type ValidationResult = {
	error?: any;
	value: any;
};

type ValidationImplementation = {
	validate: (value: any) => ValidationResult;
};

type ValidationSchemaConstructor = {
	implementation: ValidationImplementation;
};

interface IValidationSchema {
	validate: (jsonBody: object) => ValidationResult;
}

export class ValidationSchema implements IValidationSchema {
	private implementation;

	constructor({ implementation }: ValidationSchemaConstructor) {
		this.implementation = implementation;
	}

	validate(body: any) {
		return this.implementation.validate(body);
	}
}
