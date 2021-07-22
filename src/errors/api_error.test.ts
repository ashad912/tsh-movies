import faker from 'faker';

import { ApiError } from './api_error';

test('Has proper static properties', hasProperStaticProperties);
test('Can use ApiError badRequest static method', canUseBadRequest);
test('Can use ApiError notFound static method', canUseNotFound);
test('Can use ApiError internal static method', canUseInternal);
test('Can use serializeError method', canUseSerializeError);

function canUseSerializeError() {
	const fakeMessage = faker.random.words();

	const apiError = new ApiError(faker.datatype.number(), fakeMessage);

	expect(apiError.serializeError()).toEqual({ message: fakeMessage });
}

function canUseInternal() {
	const fakeMessage = faker.random.words();

	const apiError = ApiError.internal(fakeMessage);

	expect(apiError).toBeDefined();
	expect(apiError).toBeInstanceOf(ApiError);
	expect(apiError.code).toEqual(500);
	expect(apiError.message).toEqual(fakeMessage);
}
function canUseNotFound() {
	const fakeMessage = faker.random.words();

	const apiError = ApiError.notFound(fakeMessage);

	expect(apiError).toBeDefined();
	expect(apiError).toBeInstanceOf(ApiError);
	expect(apiError.code).toEqual(404);
	expect(apiError.message).toEqual(fakeMessage);
}
function canUseBadRequest() {
	const fakeMessage = faker.random.words();

	const apiError = ApiError.badRequest(fakeMessage);

	expect(apiError).toBeDefined();
	expect(apiError).toBeInstanceOf(ApiError);
	expect(apiError.code).toEqual(400);
	expect(apiError.message).toEqual(fakeMessage);
}

function hasProperStaticProperties() {
	expect(typeof ApiError.badRequest).toEqual('function');
	expect(typeof ApiError.notFound).toEqual('function');
	expect(typeof ApiError.internal).toEqual('function');
}
