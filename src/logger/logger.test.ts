import * as awilix from 'awilix';
import faker from 'faker';

import { Logger } from './logger';

test('Can create Logger instance', canCreateLogger);
test('Can use debug method', canUseDebug);
test('Can use info method', canUseInfo);
test('Can use error method', canUseError);

function canUseError() {
	const mockError = jest.fn();
	const mocked = setup(mockError);
	const container = setupContainer(mocked);

	const fakeMessage = faker.random.words();
	const fakeError = faker.random.objectElement();

	const logger = container.resolve('logger') as Logger;

	logger.error(fakeMessage, fakeError);

	expect(mockError).toHaveBeenCalledWith(fakeMessage, fakeError);

	function setup(error: () => void) {
		return {
			implementation: {
				createLogger: jest.fn().mockImplementation(() => {
					return {
						error,
					};
				}),
			},
			config: jest.fn(),
		};
	}
}
function canUseInfo() {
	const mockInfo = jest.fn();
	const mocked = setup(mockInfo);
	const container = setupContainer(mocked);

	const fakeMessage = faker.random.words();

	const logger = container.resolve('logger') as Logger;

	logger.info(fakeMessage);

	expect(mockInfo).toHaveBeenCalledWith(fakeMessage);

	function setup(info: () => void) {
		return {
			implementation: {
				createLogger: jest.fn().mockImplementation(() => {
					return {
						info,
					};
				}),
			},
			config: jest.fn(),
		};
	}
}
function canUseDebug() {
	const mockDebug = jest.fn();
	const mocked = setup(mockDebug);
	const container = setupContainer(mocked);

	const fakeMessage = faker.random.words();

	const logger = container.resolve('logger') as Logger;

	logger.debug(fakeMessage);

	expect(mockDebug).toHaveBeenCalledWith(fakeMessage);

	function setup(debug: () => void) {
		return {
			implementation: {
				createLogger: jest.fn().mockImplementation(() => {
					return {
						debug,
					};
				}),
			},
			config: jest.fn(),
		};
	}
}

function canCreateLogger() {
	const mocked = setup();
	const container = setupContainer(mocked);

	const { implementation, config } = mocked;

	const logger = container.resolve('logger') as Logger;

	expect(implementation.createLogger).toHaveBeenCalledWith(config);
	expect(logger).toBeDefined();

	function setup() {
		return {
			implementation: {
				createLogger: jest.fn(),
			},
			config: jest.fn(),
		};
	}
}

function setupContainer(mocked: object) {
	const container = awilix.createContainer({
		injectionMode: awilix.InjectionMode.PROXY,
	});

	container.register({
		logger: awilix.asClass(Logger).inject(() => mocked),
	});

	return container;
}
