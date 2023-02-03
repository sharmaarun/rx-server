import { Table as _Table, TableProps as _TableProps } from "@chakra-ui/react"
export interface TableProps extends _TableProps {

}

export function Table(props: TableProps) {
    return (
        <_Table {...props} />
    )
}

import { Thead as _Thead, TableHeadProps as _TableHeadProps } from "@chakra-ui/react"
export interface TheadProps extends _TableHeadProps {

}

export function Thead(props: TheadProps) {
    return (
        <_Thead {...props} />
    )
}

import { Tbody as _Tbody, TableBodyProps as _TableBodyProps } from "@chakra-ui/react"
export interface TbodyProps extends _TableBodyProps {

}

export function Tbody(props: TbodyProps) {
    return (
        <_Tbody {...props} />
    )
}

import { Td as _Td, TableCellProps as _TableCellProps } from "@chakra-ui/react"
export interface TdProps extends _TableCellProps {

}

export function Td(props: TdProps) {
    return (
        <_Td {...props} />
    )
}

import { Tr as _Tr, TableRowProps as _TableRowProps } from "@chakra-ui/react"
export interface TrProps extends _TableRowProps {

}

export function Tr(props: TrProps) {
    return (
        <_Tr {...props} />
    )
}

import { Th as _Th, TableColumnHeaderProps as _TableColumnHeaderProps } from "@chakra-ui/react"
export interface ThProps extends _TableColumnHeaderProps {

}

export function Th(props: ThProps) {
    return (
        <_Th {...props} />
    )
}

import { TableCaption as _TableCaption, TableCaptionProps as _TableCaptionProps } from "@chakra-ui/react"
export interface TableCaptionProps extends _TableCaptionProps {

}

export function TableCaption(props: TableCaptionProps) {
    return (
        <_TableCaption {...props} />
    )
}

import { Tfoot as _Tfoot, TableFooterProps as _TableFooterProps } from "@chakra-ui/react"
export interface TfootProps extends _TableFooterProps {

}

export function Tfoot(props: TfootProps) {
    return (
        <_Tfoot {...props} />
    )
}

import { TableContainer as _TableContainer, TableContainerProps as _TableContainerProps } from "@chakra-ui/react"
export interface TableContainerProps extends _TableContainerProps {

}

export function TableContainer(props: TableContainerProps) {
    return (
        <_TableContainer {...props} />
    )
}


export default {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Td,
    Tr,
    Th,
    TableCaption,
    TableContainer
}