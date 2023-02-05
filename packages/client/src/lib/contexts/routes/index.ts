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
    raw: Route[]
}

export const Routes = proxy<RoutesContext>({
    coreRoutes: [],
    pluginRoutes: [],
    raw: []
})

export const useRoutes = () => useSnapshot(Routes)