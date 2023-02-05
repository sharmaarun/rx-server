import React from "react"
import { Tab as _Tab, TabList as _TabList, TabListProps as _TabListProps, TabPanel as _TabPanel, TabPanelProps as _TabPanelProps, TabPanels as _TabPanels, TabPanelsProps as _TabPanelsProps, TabProps as _TabProps, Tabs as _Tabs, TabsProps as _TabsProps } from "@chakra-ui/react"

export interface TabsProps extends _TabsProps {

}

export function Tabs(props: TabsProps) {
    return (
        <_Tabs {...props} />
    )
}

export interface TabListProps extends _TabListProps {

}

export function TabList(props: TabListProps) {
    return (
        <_TabList h="100%" {...props} />
    )
}

export interface TabProps extends _TabProps {

}

export function Tab(props: TabProps) {
    return (
        <_Tab zIndex={1} p={4} _selected={{
            borderBottom:"3px solid ",
             borderColor:"brand.500",
             borderBottomLeftRadius:"3px",
             borderBottomRightRadius:"3px",
             fontWeight:"bold"
            }} {...props} />
    )
}

export interface TabPanelsProps extends _TabPanelsProps {

}

export function TabPanels(props: TabPanelsProps) {
    return (
        <_TabPanels {...props} />
    )
}

export interface TabPanelProps extends _TabPanelProps {
}

export function TabPanel(props: TabPanelProps) {
    return (
        <_TabPanel {...props} />
    )
}

export default Tabs