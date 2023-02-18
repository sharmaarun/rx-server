import { Box, Button, Heading, HStack, Icon, IconButton, Image, List, ListItem, Stack, StackProps } from "@reactive/ui"
import { BrowserRouter, Link, Outlet, Route, Routes, useLocation } from "react-router-dom"
import { useRoutes } from "@reactive/client"
import { buildRouter } from "../../utils"
import MainMenu, { MainMenuMode } from "../../components/main-menu"
import { useState } from "react"
import { RXICO_CHEVRON_LEFT, RXICO_CHEVRON_RIGHT } from "@reactive/icons"
export interface AdminLayoutProps extends StackProps {
    children?: any
}

export function RouterLayout({ children, ...props }: AdminLayoutProps) {
    const { coreRoutes, pluginRoutes } = useRoutes()
    const allRoutes = [...(coreRoutes || []), ...(pluginRoutes || [])]
    const [mode, setMode] = useState<MainMenuMode>("collapsed")
    const toggleMode = () => {
        setMode(mode === "collapsed" ? "open" : "collapsed")
    }
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
                    spacing={0}
                >
                    <Stack
                        borderRight="1px solid"
                        borderColor="blackAlpha.100"
                        {...(mode === "collapsed" ? {} : { w: "250px" })}
                        justifyContent="stretch"
                        alignItems="stretch"
                    >
                        <HStack
                            h="14"
                            p={2}
                            bg="white"
                            borderBottom="1px solid"
                            borderColor="blackAlpha.200"
                        >
                            {/* <Image src="" /> */}
                            <Heading flex={1} size="md" textAlign="center">RS</Heading>
                        </HStack>
                        <MainMenu flex={1} mode={mode} />
                        <IconButton onClick={toggleMode} variant="ghost" aria-label="">
                            <Icon>
                                {mode === "collapsed" ? <RXICO_CHEVRON_RIGHT /> : <RXICO_CHEVRON_LEFT />}
                            </Icon>
                        </IconButton>
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