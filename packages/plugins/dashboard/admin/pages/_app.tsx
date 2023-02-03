import { registerRoute, useClientContext } from "@reactive/client"
import React from "react"
import { BrowserRouter, Route, Routes, Link } from "react-router-dom"
import { HomePage } from "./index"

// registerRoute(ctx => ({
//     title: "Admin",
//     path: "/",
//     element: <HomePage />
// }))

// const router = createBrowserRouter()

function App() {
    const { routes } = useClientContext()

    const routes_ = routes?.routes?.filter(r => r?.path?.length).map(r => ({
        path: r.path,
        element: r.element
    }))
    console.log(routes_)
    return <div>
        <BrowserRouter>

            <Routes>
                {/* {routes_.map((r, ind) => */}
                {routes_?.length && <>
                    <Route path={"/admin"} element={<HomePage />} >
                        {
                            routes_.map((r, ind) => {
                                const Ele = r.element || (() => <></>)
                                return <Route key={ind} path={"/admin" + (r.path)} element={<Ele />} />
                            })
                        }
                    </Route>
                </>
                }
                {/* )} */}
            </Routes>
        </BrowserRouter>
    </div>
}
export default App

