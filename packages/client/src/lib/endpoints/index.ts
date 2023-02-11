import { PLUGINS_WEB_ROOT } from "@reactive/commons";
import { container } from "../../container";
import NetworkManager, { Method } from "../network";

export class Obj {
    private net!: NetworkManager

    constructor(private name: string) {
        this.net = container.get<NetworkManager>("NetworkManager")
    }

    public get() {
        return this.net.get(this.name)
    }
    public save() {
        throw new Error("Not impl")
    }
    public call(path: string, data?: any, method: Method = "get") {
        return this.net?.[method]?.(this.name+"/"+path, data)
    }
}

export class PluginObj extends Obj {
    constructor(name: string) {
        super(PLUGINS_WEB_ROOT + "/" + name)
    }
}