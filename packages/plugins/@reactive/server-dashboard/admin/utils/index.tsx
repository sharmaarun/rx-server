import { Route as IRoute } from "@reactive/client"
import { Route } from "react-router-dom"
export const buildRouter = (routes?: IRoute[]) => {
    return routes?.map((r, ind) => {
        const Ele = r.element || (() => <></>)
        return <Route
            key={ind}
            path={r.path}
            element={< Ele />}
        >
            {buildRouter(r?.children)}
        </Route >
    })
}