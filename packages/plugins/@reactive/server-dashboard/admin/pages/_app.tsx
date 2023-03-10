import { useClientContext } from "@reactive/client";
import { ChakraProvider, extendTheme, withDefaultColorScheme, withDefaultProps } from "@reactive/ui";
import SettingsLayout from "../layouts/settings";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import RootLayout from "../layouts/root";
import RouterLayout from "../layouts/router";
import { buildRouter } from "../utils";

function App() {
    const ctx = useClientContext()
    const { plugins: { plugins }, routes } = ctx || {}
    const { coreRoutes, pluginRoutes, rootRoutes, settingsRoutes } = routes || {}

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
                        <Route path={"/admin/settings"} element={
                            <RouterLayout>
                                <SettingsLayout>
                                    <Outlet />
                                </SettingsLayout>
                            </RouterLayout>
                        } >
                            {buildRouter(settingsRoutes as any)}
                            {/* {buildRouter(pluginRoutes as any)} */}
                        </Route>
                    </Routes>
                    <Routes>
                        <Route path={"/admin"} element={
                            <RouterLayout>
                                <Outlet />
                            </RouterLayout>
                        } >
                            {buildRouter(coreRoutes as any)}
                            {buildRouter(pluginRoutes as any)}
                        </Route>
                    </Routes>
                </RootLayout>
            </BrowserRouter>
        </ChakraProvider >
    )
}
export default App

