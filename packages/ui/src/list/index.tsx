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
export interface ListItemProps extends _ListItemProps {

}

export function ListItem(props: ListItemProps) {
    return (
        <_ListItem {...props} />
    )
}



export default {
    List,
    ListItem
}