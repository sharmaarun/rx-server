import { Menu as _Menu, MenuProps as _MenuProps } from "@chakra-ui/react"
export interface MenuProps extends _MenuProps {
}

export function Menu(props: MenuProps) {
    return (
        <_Menu {...props} />
    )
}

import { MenuItem as _MenuItem, MenuItemProps as _MenuItemProps } from "@chakra-ui/react"
export interface MenuItemProps extends _MenuItemProps {

}

export function MenuItem(props: MenuItemProps) {
    return (
        <_MenuItem {...props} />
    )
}

import { MenuGroup as _MenuGroup, MenuGroupProps as _MenuGroupProps } from "@chakra-ui/react"
export interface MenuGroupProps extends _MenuGroupProps {

}

export function MenuGroup(props: MenuGroupProps) {
    return (
        <_MenuGroup {...props} />
    )
}

import { MenuButton as _MenuButton, MenuButtonProps as _MenuButtonProps } from "@chakra-ui/react"
export interface MenuButtonProps extends _MenuButtonProps {

}

export const MenuButton=forwardRef((props: MenuButtonProps,ref:any)=> {
    return (
        <_MenuButton ref={ref} {...props} />
    )
})

import { MenuList as _MenuList, MenuListProps as _MenuListProps } from "@chakra-ui/react"
export interface MenuListProps extends _MenuListProps {

}

export function MenuList(props: MenuListProps) {
    return (
        <_MenuList {...props} />
    )
}

import { MenuOptionGroup as _MenuOptionGroup, MenuOptionGroupProps as _MenuOptionGroupProps } from "@chakra-ui/react"
export interface MenuOptionGroupProps extends _MenuOptionGroupProps {

}

export function MenuOptionGroup(props: MenuOptionGroupProps) {
    return (
        <_MenuOptionGroup {...props} />
    )
}

import { MenuItemOption as _MenuItemOption, MenuItemOptionProps as _MenuItemOptionProps } from "@chakra-ui/react"
export interface MenuItemOptionProps extends _MenuItemOptionProps {

}

export function MenuItemOption(props: MenuItemOptionProps) {
    return (
        <_MenuItemOption {...props} />
    )
}

import { MenuDivider as _MenuDivider, MenuDividerProps as _MenuDividerProps } from "@chakra-ui/react"
import { forwardRef } from "react"
export interface MenuDividerProps extends _MenuDividerProps {

}

export function MenuDivider(props: MenuDividerProps) {
    return (
        <_MenuDivider {...props} />
    )
}

export default {
    Menu,
    MenuItem,
    MenuGroup,
    MenuButton,
    MenuList,
    MenuOptionGroup,
    MenuItemOption,
    MenuDivider,
}