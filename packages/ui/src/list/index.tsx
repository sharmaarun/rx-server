import { List as _List, ListProps as _ListProps } from "@chakra-ui/react"
export interface ListProps extends _ListProps {

}

export function List(props: ListProps) {
    return (
        <_List {...props} />
    )
}

import { ListItem as _ListItem, ListItemProps as _ListItemProps } from "@chakra-ui/react"
import { RXICO_CHECKMARK } from "@reactive/icons"
import Box from "../box"
import Card from "../card"
import Icon from "../icon"
export interface ListItemProps extends _ListItemProps {
    isActive?: boolean
}

export function ListItem({ isActive, ...props }: ListItemProps) {
    return (
        <_ListItem
            p={2}
            borderRadius={4}
            display="flex"
            justifyContent="stretch"
            alignItems="stretch"
            {...props} />
    )
}
export function LinkListItem({ isActive, ...props }: ListItemProps) {
    return (
        <_ListItem
            p={2}
            bgColor={isActive ? "blackAlpha.200" : ""}
            _hover={{ bgColor: isActive ? "" : "blackAlpha.50" }}
            borderRadius={4}
            display="flex"
            justifyContent="stretch"
            alignItems="stretch"
            {...props} />
    )
}

export interface ActionListItemProps extends ListItemProps {
    leftItem?: any
    showIcons?: boolean
}

export function ActionListItem({ isActive, showIcons = false, children, leftItem, ...props }: ActionListItemProps) {
    return (
        <_ListItem
            borderRadius={8}
            border="2px solid transparent"
            _hover={{
                borderColor: "purple.500",
                bgColor: "gray.50"
            }}
            cursor={"pointer"}
            shadow="base"
            p={4}
            w="100%"
            as={Card}
            display="flex"
            spacing={4}
            flexDir="row"
            {...props} >
            {showIcons ? <>{leftItem ||
                <Icon color={isActive ? "purple.500" : "gray.50"} >
                    <RXICO_CHECKMARK />
                </Icon>
            }</> : ""}
            <Box pl={2} flex={1}>
                {children}
            </Box>
        </_ListItem>
    )
}



export default {
    List,
    ListItem
}