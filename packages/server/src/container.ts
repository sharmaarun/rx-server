import { Container } from 'inversify';
import { DBManager } from './lib/db';
import { EndpointManager } from './lib/endpoints';
import { ExpressManager } from './lib/express';
import { LocalFS } from './lib/fs';
import { APIGenerator } from './lib/generator/api';
import { Logger } from './lib/logger';
import { PluginsManager } from './lib/plugin';
import SettingsManager from './lib/settings';

const container = new Container()

container.bind<DBManager>(DBManager).to(DBManager).inSingletonScope()
container.bind<PluginsManager>(PluginsManager).to(PluginsManager).inSingletonScope()
container.bind<Logger>(Logger).to(Logger).inSingletonScope()
container.bind<EndpointManager>(EndpointManager).to(EndpointManager).inSingletonScope()
container.bind<ExpressManager>(ExpressManager).to(ExpressManager).inSingletonScope()
container.bind<SettingsManager>(SettingsManager).to(SettingsManager).inSingletonScope()
container.bind<LocalFS>(LocalFS).to(LocalFS).inSingletonScope()
container.bind<APIGenerator>(APIGenerator).to(APIGenerator).inSingletonScope()


// export main services
export const logger = container.get<Logger>(Logger)
export const endpoints = container.get<EndpointManager>(EndpointManager)
export const db = container.get<DBManager>(DBManager)
export const plugins = container.get<PluginsManager>(PluginsManager)
export const app = container.get<ExpressManager>(ExpressManager)
export const settings = container.get<SettingsManager>(SettingsManager)
export const fs = container.get<LocalFS>(LocalFS)
export const apiGen = container.get<APIGenerator>(APIGenerator)

export default container