import { Box, Button, HStack, Image, List, ListItem, Stack, StackProps } from "@reactive/ui"
import { BrowserRouter, Link, Outlet, Route, Routes, useLocation } from "react-router-dom"
import { useRoutes } from "@reactive/client"
import { buildRouter } from "../../utils"
import MainMenu from "../../components/main-menu"
export interface AdminLayoutProps extends StackProps {
    children?: any
}

export function RouterLayout({ children, ...props }: AdminLayoutProps) {
    const { coreRoutes, pluginRoutes } = useRoutes()
    const allRoutes = [...(coreRoutes || []), ...(pluginRoutes || [])]
    return (
        <BrowserRouter>
            <Stack {...props}
                justifyContent="stretch"
                alignItems="stretch"
            >
                <HStack
                    justifyContent="stretch"
                    alignItems="stretch"
                    h="100vh"
                >
                    <Stack
                        borderRight="1px solid"
                        borderColor="blackAlpha.300"
                        w="250px"
                    >
                        <Image src="" />
                        <MainMenu />
                    </Stack>
                    <Stack flex={1}>
                        <Routes>
                            <Route path={"/admin"} element={<Outlet />} >
                                {buildRouter(allRoutes as any)}
                            </Route>
                        </Routes>
                    </Stack>
                </HStack>
            </Stack>
        </BrowserRouter>
    )
}

export default RouterLayout