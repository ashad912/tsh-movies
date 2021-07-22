import * as awilix from 'awilix';
import faker from 'faker';
import { NextFunction, Request, Response } from 'express';

import { ExpressMiddleware } from '../server/express.type';

import { validator } from './validator';

test('Can create validator', canCreateValidationSchema);
test('Can use validator to throw error', canThrowError);
test('Can use validator to validate values', canValidate);

function canValidate() {
	const fakeValue = faker.datatype.json();
	const mocked = setup();

	const { logger } = mocked;

	const fakeRequest = {
		body: jest.fn(),
	} as Request;
	const fakeResponse = jest.fn() as any as Response;
	const fakeNext = jest.fn() as NextFunction;

	const container = setupContainer(mocked);

	const validate = container.resolve('validator') as ExpressMiddleware<void>;

	validate(fakeRequest, fakeResponse, fakeNext);

	expect(fakeRequest.body).toBe(fakeValue);
	expect(logger.debug).toBeCalled();
	expect(logger.debug.mock.calls[0][0]).toMatch(/passed/);
	expect(fakeNext).toHaveBeenCalledWith();

	function setup() {
		return {
			validationSchema: {
				validate: jest.fn().mockImplementation(() => ({
					value: fakeValue,
				})),
			},
			ApiErrorClass: jest.fn(),
			logger: {
				debug: jest.fn(),
			},
		};
	}
}

function canThrowError() {
	const fakeError = faker.random.words();
	const mocked = setup();

	const { logger } = mocked;

	const fakeRequest = jest.fn() as any as Request;
	const fakeResponse = jest.fn() as any as Response;
	const fakeNext = jest.fn() as NextFunction;

	const container = setupContainer(mocked);

	const validate = container.resolve('validator') as ExpressMiddleware<void>;

	expect(testValidate).toThrow(fakeError);
	expect(logger.debug).toBeCalled();
	expect(logger.debug.mock.calls[0][0]).toMatch(/failed/);
	expect(fakeNext).not.toBeCalled();

	function testValidate() {
		return validate(fakeRequest, fakeResponse, fakeNext);
	}

	function setup() {
		return {
			validationSchema: {
				validate: jest.fn().mockImplementation(() => ({
					error: fakeError,
				})),
			},
			ApiErrorClass: {
				badRequest: jest.fn().mockImplementation(() => {
					return Error(fakeError);
				}),
			},
			logger: {
				debug: jest.fn(),
			},
		};
	}
}

function canCreateValidationSchema() {
	const mocked = setup();
	const container = setupContainer(mocked);

	const validator = container.resolve('validator') as ExpressMiddleware<void>;

	expect(validator).toBeDefined();

	function setup() {
		return {
			validationSchema: jest.fn(),
			ApiErrorClass: jest.fn(),
			logger: jest.fn(),
		};
	}
}

function setupContainer(mocked: object) {
	const container = awilix.createContainer({
		injectionMode: awilix.InjectionMode.PROXY,
	});

	container.register({
		validator: awilix.asFunction(validator).inject(() => mocked),
	});

	return container;
}
