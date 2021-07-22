import * as awilix from 'awilix';
import faker from 'faker';
import { NextFunction, Request, Response } from 'express';

import { ExpressErrorHandler } from '../server/express.type';
import { ApiError } from './api_error';

import { createErrorHandler } from './error_handler';

test('Can create errorHandler', canCreateErrorHandler);
test('Can use errorHandler with custom ApiError', canUseApiError);
test('Can use errorHandler with Error type', canUseWithError);

function canUseWithError() {
	const fakeCode = faker.datatype.number();
	const fakeErrorOutput = 'Something went wrong';

	const mockSerializeError = jest
		.fn()
		.mockImplementation(() => fakeErrorOutput);
	const mockInternal = jest.fn();
	const mockJson = jest.fn();

	const mocked = setup(fakeCode, mockSerializeError, mockInternal);

	const { logger } = mocked;

	const fakeError = new Error();
	const fakeRequest = jest.fn() as any as Request;
	const fakeResponse = {
		status: jest.fn().mockImplementation(() => ({
			json: mockJson,
		})),
	} as any as Response;
	const fakeNext = jest.fn() as NextFunction;

	const container = setupContainer(mocked);

	const handleError = container.resolve(
		'errorHandler',
	) as ExpressErrorHandler<void>;

	handleError(fakeError, fakeRequest, fakeResponse, fakeNext);

	expect(logger.error).toBeCalled();
	expect(mockInternal).toHaveBeenCalledWith(fakeErrorOutput);
	expect(fakeResponse.status).toHaveBeenCalledWith(fakeCode);
	expect(mockJson).toHaveBeenCalledWith(fakeErrorOutput);
	expect(mockSerializeError).toHaveBeenCalledWith();

	function setup(
		fakeCode: number,
		serializeError: () => void,
		internal: (mssg: string) => void,
	) {
		return {
			logger: {
				error: jest.fn(),
			},
			ApiErrorClass: class ApiError {
				private code: number;
				private serializeError: () => void;

				constructor() {
					this.code = fakeCode;
					this.serializeError = serializeError;
				}

				static internal(message: string) {
					internal(message);
					return new ApiError();
				}
			},
		};
	}
}
function canUseApiError() {
	const fakeCode = faker.datatype.number();
	const fakeErrorOutput = faker.datatype.string();

	const mockSerializeError = jest
		.fn()
		.mockImplementation(() => fakeErrorOutput);
	const mockJson = jest.fn();

	const mocked = setup(fakeCode, mockSerializeError);

	const { logger, ApiErrorClass } = mocked;

	const fakeError = new ApiErrorClass() as any as ApiError;
	const fakeRequest = jest.fn() as any as Request;
	const fakeResponse = {
		status: jest.fn().mockImplementation(() => ({
			json: mockJson,
		})),
	} as any as Response;
	const fakeNext = jest.fn() as NextFunction;

	const container = setupContainer(mocked);

	const handleError = container.resolve(
		'errorHandler',
	) as ExpressErrorHandler<void>;

	handleError(fakeError, fakeRequest, fakeResponse, fakeNext);

	expect(logger.error).toBeCalled();
	expect(fakeResponse.status).toHaveBeenCalledWith(fakeCode);
	expect(mockJson).toHaveBeenCalledWith(fakeErrorOutput);
	expect(mockSerializeError).toHaveBeenCalledWith();

	function setup(fakeCode: number, serializeError: () => void) {
		return {
			logger: {
				error: jest.fn(),
			},
			ApiErrorClass: class {
				private code: number;
				private serializeError: () => void;

				constructor() {
					this.code = fakeCode;
					this.serializeError = serializeError;
				}
			},
		};
	}
}

function canCreateErrorHandler() {
	const mocked = setup();
	const container = setupContainer(mocked);

	const errorHandler = container.resolve(
		'errorHandler',
	) as ExpressErrorHandler<void>;

	expect(errorHandler).toBeDefined();

	function setup() {
		return {
			logger: jest.fn(),
			ApiErrorClass: jest.fn(),
		};
	}
}

function setupContainer(mocked: object) {
	const container = awilix.createContainer({
		injectionMode: awilix.InjectionMode.PROXY,
	});

	container.register({
		errorHandler: awilix.asFunction(createErrorHandler).inject(() => mocked),
	});

	return container;
}
