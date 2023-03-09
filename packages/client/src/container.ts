import { Container } from "inversify";
import { AttributesManager } from "./lib/attributes";
import NetworkManager from "./lib/network";
import { PluginsManager } from "./lib/plugins";
import { RoutesManager } from "./lib/routes";

export const container = new Container()
container.bind<PluginsManager>("PluginsManager").to(PluginsManager).inSingletonScope();
container.bind<RoutesManager>("RoutesManager").to(RoutesManager).inSingletonScope();
container.bind<NetworkManager>("NetworkManager").to(NetworkManager).inSingletonScope();
container.bind<AttributesManager>("AttributesManager").to(AttributesManager).inSingletonScope();

(global as any).container = (global as any).container || container;