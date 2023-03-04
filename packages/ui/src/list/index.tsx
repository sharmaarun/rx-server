import React from "react"
import { List as _List, ListProps as _ListProps } from "@chakra-ui/react"
export interface ListProps extends _ListProps {

}

export function List(props: ListProps) {
    return (
        <_List {...props} />
    )
}

import { ListItem as _ListItem, ListItemProps as _ListItemProps } from "@chakra-ui/react"
import Card from "../card"
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
export function ActionListItem({ isActive, children, ...props }: ListItemProps) {
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
            {...props} >
            {children}
        </_ListItem>
    )
}



export default {
    List,
    ListItem
}