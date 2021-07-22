type LoggerMessage = string | number | boolean | object;

type LoggerInstance = {
	debug: (message: LoggerMessage) => void;
	info: (message: LoggerMessage) => void;
	error: (message: LoggerMessage, error?: any) => void;
};

interface LoggerConfig {
	level: string;
}

type LoggerImplementation = {
	createLogger(config?: LoggerConfig): LoggerInstance;
};

type LoggerConstructor = {
	implementation: LoggerImplementation;
	config: LoggerConfig;
};

interface ILogger {
	debug: (message: LoggerMessage) => void;
	info: (message: LoggerMessage) => void;
	error: (message: LoggerMessage, error?: any) => void;
}

export class Logger implements ILogger {
	private logger: LoggerInstance;

	constructor({ implementation, config }: LoggerConstructor) {
		this.logger = implementation.createLogger(config);
	}

	debug(message: LoggerMessage) {
		this.logger.debug(message);
	}

	info(message: LoggerMessage) {
		this.logger.info(message);
	}

	error(message: LoggerMessage, error?: any) {
		this.logger.error(message, error);
	}
}
