export type ServerDone = (err?: Error | undefined) => void;

export type Server = {
	setup: () => void;
	run: (port: number) => void;
	stop: (done: ServerDone) => void;
};
