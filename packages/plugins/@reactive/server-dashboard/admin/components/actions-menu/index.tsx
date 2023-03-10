import { useMenusContext } from "@reactive/client"
import { toPascalCase } from "@reactive/commons"
import { HStack, Icon, List, ListProps, Stack, ListItem, Text } from "@reactive/ui"
import { Link, useLocation } from "react-router-dom"
import { MainMenuMode } from "../main-menu"

export interface ActionsMenuProps extends ListProps {
    children?: any,
    mode?: MainMenuMode
}

export function ActionsMenu({ children, mode, ...props }: ActionsMenuProps) {
    const { settingsMenu } = useMenusContext()
    const { pathname } = useLocation()
    return (
        <>
            <List flexWrap="nowrap" p={4} spacing={2} {...props}>
                <Stack spacing={2}>
                    {settingsMenu?.map((r, ind) => {
                        const isActive = r.link && pathname?.startsWith(r.link)
                        const Ico = r.icon || (() => <></>)
                        const item = <ListItem
                            cursor="pointer"
                            p={2}
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
                                    {r.title || toPascalCase(r.name)}
                                </Text> : ""}
                            </HStack>
                        </ListItem>
                        return r.link ? <Link
                            key={ind}
                            to={r.link || "javascript:void(0);"}
                        >
                            {item}
                        </Link> : item
                    }
                    )}
                </Stack>
            </List>
        </>
    )
}

export default ActionsMenu