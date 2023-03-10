import { registerCoreRoute, registerSettingsMenuItem, Route, SettingsMenuItem } from "@reactive/client"
import { RXICO_COG } from "@reactive/icons"
import { Text } from "@reactive/ui"
import SettingsPage from "../../pages/settings"


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

// ========= SETTINGS ROUTES

const coreSettingsRoutes = [
    {
        path: "settings",
        element: SettingsPage,
        title: "Settings Page"
    }
] as Route[]

/**
 * Register core settings routes
 */
export const registerCoreSettingsRoutes = () => {
    for (let route of coreSettingsRoutes) {
        registerCoreRoute(ctx => route)
    }
}