import { Route as IRoute } from "@reactive/client"
import { Route } from "react-router-dom"

//============ ROUTES RELATED

export const buildRouter = (routes: IRoute[], Wrapper?: any) => {
    Wrapper = Wrapper || ((props: any) => props.children)
    return routes?.map((r, ind) => {
        const Ele = Wrapper ? (props: any) => <Wrapper>
            <r.element {...props} />
        </Wrapper> : r.element
        return (
            <Route
                key={ind}
                path={r.path}
                element={<Ele />}
            >
                {buildRouter(r?.children || [], Wrapper)}
            </Route >
        )
    })
}

