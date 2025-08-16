import './common/env.js';
import Server from './common/server.js';
import routes from './routes.js';

const server = new Server().router(routes).listen(process.env.PORT);
export default server;
