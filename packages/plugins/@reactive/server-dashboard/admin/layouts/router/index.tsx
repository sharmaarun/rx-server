import { useRoutes } from "@reactive/client"
import { RXICO_CHEVRON_LEFT, RXICO_CHEVRON_RIGHT } from "@reactive/icons"
import { Heading, HStack, Icon, IconButton, Stack, StackProps } from "@reactive/ui"
import { useState } from "react"
import { BrowserRouter } from "react-router-dom"
import MainMenu, { MainMenuMode } from "../../components/main-menu"
export interface AdminLayoutProps extends StackProps {
    children?: any
}

export function RouterLayout({ children, ...props }: AdminLayoutProps) {
    const [mode, setMode] = useState<MainMenuMode>("collapsed")
    const toggleMode = () => {
        setMode(mode === "collapsed" ? "open" : "collapsed")
    }
    return (
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
                    {/* <Routes>
                            <Route path={"/admin"} element={<Outlet />} >
                                {buildRouter(allRoutes as any)}
                            </Route>
                        </Routes> */}
                    {children}
                </Stack>
            </HStack>
        </Stack>
    )
}

export default RouterLayout