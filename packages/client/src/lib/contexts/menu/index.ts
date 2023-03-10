import { proxy, useSnapshot } from "valtio"
import { SettingsMenuItem } from "../../menu"

export type MenusContext = {
    settingsMenu: SettingsMenuItem[]
}

export const MenusContext = proxy<MenusContext>({
    settingsMenu: []
})

export const useMenusContext = () => useSnapshot<MenusContext>(MenusContext)