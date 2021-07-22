import * as awilix from 'awilix';
import faker from 'faker';

import { DataSource } from './data_source';

test('Can create DataSource instance', canCreateDataSource);
test('Can use read method', canUseRead);
test('Can use write method', canUseWrite);

async function canUseWrite() {
	const fakeDB = {
		genres: [],
		movies: [],
	};
	const mocked = setup();
	const container = setupContainer(mocked);

	const { fs, dbFileName } = mocked;

	const dataSource = container.resolve('dataSource') as DataSource;

	await dataSource.write(fakeDB);

	expect(fs.writeFile).toHaveBeenCalledWith(dbFileName, JSON.stringify(fakeDB));

	function setup() {
		return {
			fs: {
				writeFile: jest.fn(),
			},
			dbFileName: jest.fn(),
		};
	}
}

async function canUseRead() {
	const fakeDBString = faker.datatype.json();

	const mocked = setup();
	const container = setupContainer(mocked);

	const { fs, dbFileName } = mocked;

	const dataSource = container.resolve('dataSource') as DataSource;

	const db = await dataSource.read();

	expect(fs.readFile).toHaveBeenCalledWith(dbFileName, 'utf8');
	expect(db).toEqual(JSON.parse(fakeDBString));

	function setup() {
		return {
			fs: {
				readFile: jest.fn().mockResolvedValue(fakeDBString),
			},
			dbFileName: jest.fn(),
		};
	}
}

function canCreateDataSource() {
	const mocked = setup();
	const container = setupContainer(mocked);

	const dataSource = container.resolve('dataSource') as DataSource;

	expect(dataSource).toBeDefined();

	function setup() {
		return {
			fs: jest.fn(),
			dbFileName: jest.fn(),
		};
	}
}

function setupContainer(mocked: object) {
	const container = awilix.createContainer({
		injectionMode: awilix.InjectionMode.PROXY,
	});

	container.register({
		dataSource: awilix.asClass(DataSource).inject(() => mocked),
	});

	return container;
}
