import * as awilix from 'awilix';
import faker from 'faker';

import { createServer } from './server';
import { Server } from './server.type';

test('Can create server', canCreateServer);
test('Can call setup', canCallSetup);
test('Can call run', canCallRun);
test('Cannot stop server if it is not started', cannotStopServer);
test('Can stop server', canStopServer);

function canStopServer() {
	const serverInstance = {
		close: jest.fn(),
	};
	const mocked = setup();
	const { logger } = mocked;
	const done = jest.fn();

	const container = setupContainer(mocked);
	const server = container.resolve('server') as Server;

	server.run(faker.datatype.number());
	server.stop(done);

	expect(logger.error).not.toHaveBeenCalled();
	expect(serverInstance.close).toHaveBeenCalledWith(done);
	expect(logger.info).toHaveBeenCalled();

	function setup() {
		return {
			app: {
				listen: jest.fn().mockImplementation(() => serverInstance),
			},
			bodyParser: jest.fn(),
			movieRouter: jest.fn(),
			ApiErrorClass: jest.fn(),
			errorHandler: jest.fn(),
			logger: {
				info: jest.fn(),
				error: jest.fn(),
			},
		};
	}
}
function cannotStopServer() {
	const serverInstance = {
		close: jest.fn(),
	};
	const mocked = setup();
	const { logger } = mocked;
	const done = jest.fn();

	const container = setupContainer(mocked);
	const server = container.resolve('server') as Server;

	server.stop(done);

	expect(logger.error).toHaveBeenCalled();
	expect(serverInstance.close).not.toHaveBeenCalled();

	function setup() {
		return {
			app: {
				listen: jest.fn().mockImplementation(() => serverInstance),
			},
			bodyParser: jest.fn(),
			movieRouter: jest.fn(),
			ApiErrorClass: jest.fn(),
			errorHandler: jest.fn(),
			logger: {
				error: jest.fn(),
			},
		};
	}
}

function canCallRun() {
	const mocked = setup();
	const { app, logger } = mocked;
	const fakePort = faker.datatype.number();

	const container = setupContainer(mocked);
	const server = container.resolve('server') as Server;

	server.run(fakePort);

	expect(app.listen).toHaveBeenCalledWith(fakePort, expect.any(Function));
	expect(logger.info).toHaveBeenCalled();

	function setup() {
		return {
			app: {
				listen: jest.fn().mockImplementation((_port, cb) => {
					cb();
				}),
			},
			bodyParser: jest.fn(),
			movieRouter: jest.fn(),
			ApiErrorClass: jest.fn(),
			errorHandler: jest.fn(),
			logger: {
				info: jest.fn(),
			},
		};
	}
}
function canCallSetup() {
	const mocked = setup();
	const container = setupContainer(mocked);

	const { app, logger, bodyParser, movieRouter, errorHandler } = mocked;

	const server = container.resolve('server') as Server;

	server.setup();

	expect(app.use).toHaveBeenCalledWith(bodyParser);
	expect(app.use).toHaveBeenCalledWith('/api/movies', movieRouter);
	expect(app.all).toHaveBeenCalledWith('*', expect.any(Function));
	expect(app.use).toHaveBeenCalledWith(errorHandler);
	expect(logger.info).toHaveBeenCalled();

	function setup() {
		return {
			app: {
				use: jest.fn(),
				all: jest.fn(),
			},
			bodyParser: jest.fn(),
			movieRouter: jest.fn(),
			ApiErrorClass: jest.fn(),
			errorHandler: jest.fn(),
			logger: {
				info: jest.fn(),
			},
		};
	}
}

function canCreateServer() {
	const mocked = setup();
	const container = setupContainer(mocked);

	const server = container.resolve('server') as Server;

	expect(server).toBeDefined();

	function setup() {
		return {
			app: jest.fn(),
			bodyParser: jest.fn(),
			movieRouter: jest.fn(),
			ApiErrorClass: jest.fn(),
			errorHandler: jest.fn(),
			logger: jest.fn(),
		};
	}
}

function setupContainer(mocked: object) {
	const container = awilix.createContainer({
		injectionMode: awilix.InjectionMode.PROXY,
	});

	container.register({
		server: awilix.asFunction(createServer).inject(() => mocked),
	});

	return container;
}
