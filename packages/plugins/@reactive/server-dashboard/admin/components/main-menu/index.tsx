import { useRoutes } from "@reactive/client"
import { HStack, Icon, List, ListItem, Stack, StackProps, Text } from "@reactive/ui"
import { Link, useLocation } from "react-router-dom"

export type MainMenuMode = "collapsed" | "open"

export interface MainMenuProps extends StackProps {
    children?: any
    mode?: MainMenuMode
}

export function MainMenu({ children, mode = "open", ...props }: MainMenuProps) {
    const { coreRoutes, pluginRoutes } = useRoutes()
    const allRoutes = [...(coreRoutes || []), ...(pluginRoutes || [])]
    const { pathname } = useLocation()
    return (
        <>
            <List flexWrap="nowrap" p={4} spacing={2} {...props}>
                <Stack spacing={2}>
                    {allRoutes?.map((r, ind) => {
                        const isActive = pathname?.startsWith(r.path)
                        const Ico = r.icon || (() => <></>)
                        return <Link
                            key={ind}
                            to={r.path}

                        >
                            <ListItem p={2}
                                borderRadius={4}
                                color={isActive ? "whiteAlpha.900" : ""}
                                bgColor={isActive ? "purple.500" : ""}
                                _hover={{ bgColor: isActive ? "" : "gray.100" }}
                            >
                                <HStack textOverflow="ellipsis">
                                    <Icon>
                                        {<Ico />}
                                    </Icon>
                                    {mode === "open" ? <Text whiteSpace="nowrap" >
                                        {r.title}
                                    </Text> : ""}
                                </HStack>
                            </ListItem>
                        </Link>
                    }
                    )}
                </Stack>
            </List>
        </>
    )
}

export default MainMenu