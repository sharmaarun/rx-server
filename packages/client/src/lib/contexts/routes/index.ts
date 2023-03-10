import { proxy, useSnapshot } from "valtio"

export type Route = {
    id?: string
    title: string,
    path: string,
    icon: any,
    element: any,
    children?: Route[]
    isCore?: boolean
}

export type RoutesContext = {
    coreRoutes: Route[]
    pluginRoutes: Route[]
    rootRoutes: Route[]
    settingsRoutes: Route[]
    /**
     * All routes
     */
    raw: Route[]
}

export const RoutesContext: RoutesContext = proxy<RoutesContext>({
    coreRoutes: [],
    pluginRoutes: [],
    rootRoutes: [],
    settingsRoutes: [],
    raw: []
})

export const useRoutes = () => useSnapshot(RoutesContext)