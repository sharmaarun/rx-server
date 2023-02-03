import { proxy } from "valtio"

export type Route = {
    title: string,
    path: string,
    icon: any,
    element: any
}

export type RoutesContext = {
    routes: Route[]
}

export const Routes = proxy<RoutesContext>({
    routes: []
})