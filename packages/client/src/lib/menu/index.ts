import { injectable } from "inversify";
import { ClientContext } from "../contexts";
import { PluginClass } from "../plugins";

/**
 * General menu item type 
 */
export type MenuItem = {
    id?: string | number,
    /**
     * Unique name
     */
    name: string,
    /**
     * Title to display
     */
    title?:string,
    /**
     * Icon to display in the settings menu
     */
    icon: any,
    /**
     * link (href) to other location
     */
    link?: string,
    /**
     * on click handler
     */
    onClick?: any
}

/**
 * Settings menu item type
 */
export type SettingsMenuItem = MenuItem & {
}


@injectable()
export class MenusManager extends PluginClass {
    private idCounter: number = 0
    public override async init(ctx: ClientContext) {
        super.ctx = ctx
    }

    public registerSettingsMenuItem = (cb: (ctx: ClientContext) => SettingsMenuItem) => {
        const item = cb(this.ctx)
        const exists = this.ctx.menus.settingsMenu.find(m => m.name === item.name)
        if (exists) throw new Error(`Settings menu item already exists for this name ${item.name}`)
        item.id = this.idCounter++
        this.ctx.menus.settingsMenu.push(item)
    }
}