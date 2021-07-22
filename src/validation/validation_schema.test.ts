import * as awilix from 'awilix';
import faker from 'faker';

import { ValidationSchema } from './validation_schema';

test('Can create ValidationSchema instance', canCreateValidationSchema);
test('Can use validate method', canUseValidate);

function canUseValidate() {
	const mocked = setup();
	const container = setupContainer(mocked);

	const { implementation } = mocked;

	const fakeBody = faker.datatype.json();

	const validationSchema = container.resolve(
		'validationSchema',
	) as ValidationSchema;

	validationSchema.validate(fakeBody);

	expect(implementation.validate).toHaveBeenCalledWith(fakeBody);

	function setup() {
		return {
			implementation: {
				validate: jest.fn(),
			},
		};
	}
}

function canCreateValidationSchema() {
	const mocked = setup();
	const container = setupContainer(mocked);

	const validationSchema = container.resolve(
		'validationSchema',
	) as ValidationSchema;

	expect(validationSchema).toBeDefined();

	function setup() {
		return {
			implementation: jest.fn(),
		};
	}
}

function setupContainer(mocked: object) {
	const container = awilix.createContainer({
		injectionMode: awilix.InjectionMode.PROXY,
	});

	container.register({
		validationSchema: awilix.asClass(ValidationSchema).inject(() => mocked),
	});

	return container;
}
