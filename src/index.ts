import { setupContainer } from './di_container/di_container';
import { Server } from './server/server.type';

const container = setupContainer();

const server = container.resolve('server') as Server;

server.setup();
server.run(80);
