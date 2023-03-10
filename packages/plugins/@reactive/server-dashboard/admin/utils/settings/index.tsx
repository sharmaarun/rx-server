import { registerCoreRoute, registerSettingsMenuItem, Route, SettingsMenuItem } from "@reactive/client"
import { RXICO_COG } from "@reactive/icons"
import { Text } from "@reactive/ui"


// ========== SETTINGS MENU RELATED

const settingsMenuItems = [
    {
        name: "settings",
        title: "Settings",
        link: "/admin/settings",
        icon: () => <RXICO_COG />
    }
] as SettingsMenuItem[]

/**
 * Register core settings menu items
 */
export const registerCoreSettingsMenuItems = () => {
    settingsMenuItems.forEach(smi => {
        registerSettingsMenuItem(ctx => smi)
    })
}