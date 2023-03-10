import { useMenusContext, useRoutes } from "@reactive/client"
import { toPascalCase } from "@reactive/commons"
import { HStack, Icon, List, ListProps, Stack, ListItem, Text, LinkListItem } from "@reactive/ui"
import { Link, useLocation } from "react-router-dom"
import { MainMenuMode } from "../main-menu"

export interface SettingsMenuProps extends ListProps {
    children?: any,
    mode?: MainMenuMode
}

export function SettingsMenu({ children, mode = "open", ...props }: SettingsMenuProps) {
    const { settingsRoutes } = useRoutes()
    const { pathname } = useLocation()
    return (
        <>
            <List flexWrap="nowrap" spacing={2} {...props}>
                {settingsRoutes?.map((r, ind) => {
                    const isActive = r.path ? pathname?.startsWith("/admin/settings/" + r.path) : false
                    const Ico = r.icon || (() => <></>)
                    const item = <LinkListItem
                        key={ind}
                        isActive={isActive}
                    >
                        <HStack textOverflow="ellipsis">
                            <Icon>
                                {<Ico />}
                            </Icon>
                            {mode === "open" ? <Text whiteSpace="nowrap" >
                                {r.title}
                            </Text> : ""}
                        </HStack>
                    </LinkListItem>
                    return r.path ? <Link
                        key={ind}
                        to={r.path ? `/admin/settings/${r.path}` : "javascript:void(0);"}
                    >
                        {item}
                    </Link> : item
                }
                )}
            </List>
        </>
    )
}

export default SettingsMenu