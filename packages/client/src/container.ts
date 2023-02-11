import { Container } from "inversify";
import { FieldsManager } from "./lib/fields";
import NetworkManager from "./lib/network";
import { PluginsManager } from "./lib/plugins/manager";
import { RoutesManager } from "./lib/routes";

export const container = new Container()
container.bind<PluginsManager>("PluginsManager").to(PluginsManager).inSingletonScope();
container.bind<RoutesManager>("RoutesManager").to(RoutesManager).inSingletonScope();
container.bind<NetworkManager>("NetworkManager").to(NetworkManager).inSingletonScope();
container.bind<FieldsManager>("FieldsManager").to(FieldsManager).inSingletonScope();

(global as any).container = (global as any).container || container;