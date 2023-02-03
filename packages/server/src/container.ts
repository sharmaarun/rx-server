import { Container } from 'inversify';
import { EndpointManager } from './lib/endpoints';
import { DBManager } from './lib/db';
import { Logger } from './lib/logger';
import { PluginsManager } from './lib/plugin';
import { ExpressManager } from './lib/express';

const container = new Container()

container.bind<DBManager>(DBManager).to(DBManager).inSingletonScope()
container.bind<PluginsManager>(PluginsManager).to(PluginsManager).inSingletonScope()
container.bind<Logger>(Logger).to(Logger).inSingletonScope()
container.bind<EndpointManager>(EndpointManager).to(EndpointManager).inSingletonScope()
container.bind<ExpressManager>(ExpressManager).to(ExpressManager).inSingletonScope()

export default container