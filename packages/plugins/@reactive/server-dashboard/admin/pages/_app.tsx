import { ClientContext, PluginClass, useClientContext } from "@reactive/client";
import { Plugin } from "@reactive/commons";
import { ChakraProvider, extendTheme, withDefaultColorScheme, withDefaultProps } from "@reactive/ui";
import { useEffect } from "react";
import { BrowserRouter, createBrowserRouter, Outlet, Route, Router, Routes, useLocation, useNavigate, useRoutes } from "react-router-dom";
import RootLayout from "../layouts/root";
import RouterLayout from "../layouts/router";
import { buildRouter } from "../utils";

function App() {
    const ctx = useClientContext()
    const { plugins: { plugins }, routes } = ctx || {}
    const { coreRoutes, pluginRoutes, rootRoutes } = routes || {}
    const allRoutes = [...(coreRoutes || []), ...(pluginRoutes || [])]

    console.log("allRoutes", allRoutes, "rootRoutes", rootRoutes)
    return (
        <ChakraProvider theme={extendTheme(
            withDefaultColorScheme({
                colorScheme: "purple"
            }),
            withDefaultProps({
                defaultProps: {
                    "variant": "outline"
                },
                components: ["Button"]
            })
        )}>
            <BrowserRouter>
                <RootLayout>
                    <Routes>
                        <Route path={"/"} element={<Outlet />} >
                            {buildRouter(rootRoutes as any)}
                        </Route>
                    </Routes>

                    <Routes>
                        <Route path={"/admin"} element={
                            <RouterLayout>
                                <Outlet />
                            </RouterLayout>
                        } >
                            {buildRouter(allRoutes as any)}
                        </Route>
                        {/* <Route path={"/"} element={<Outlet />} >
                            {buildRouter(rootRoutes as any )}
                        </Route> */}
                    </Routes>
                </RootLayout>
            </BrowserRouter>
        </ChakraProvider >
    )
}
export default App

