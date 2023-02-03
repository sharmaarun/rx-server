import { Container } from "inversify";
import { PluginsManager } from "./lib/plugins/manager";
import { RoutesManager } from "./lib/routes";

export const container = new Container()
container.bind<PluginsManager>("PluginsManager").to(PluginsManager).inSingletonScope();
container.bind<RoutesManager>("RoutesManager").to(RoutesManager).inSingletonScope();

(global as any).container = (global as any).container || container;