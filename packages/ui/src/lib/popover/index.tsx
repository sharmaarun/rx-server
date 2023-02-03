import { Popover as _Popover, PopoverProps as _PopoverProps } from "@chakra-ui/react"
export interface PopoverProps extends _PopoverProps {

}

export function Popover(props: PopoverProps) {
    return (
        <_Popover {...props} />
    )
}

import { PopoverTrigger as _PopoverTrigger } from "@chakra-ui/react"
export interface PopoverTriggerProps {

}

export const PopoverTrigger = (props: PopoverTriggerProps) => {
    return (
        <_PopoverTrigger {...props} />
    )
}

import { PopoverContent as _PopoverContent, PopoverContentProps as _PopoverContentProps } from "@chakra-ui/react"
export interface PopoverContentProps extends _PopoverContentProps {

}

export function PopoverContent(props: PopoverContentProps) {
    return (
        <_PopoverContent {...props} />
    )
}

import { PopoverArrow as _PopoverArrow, PopoverArrowProps as _PopoverArrowProps } from "@chakra-ui/react"
export interface PopoverArrowProps extends _PopoverArrowProps {

}

export function PopoverArrow(props: PopoverArrowProps) {
    return (
        <_PopoverArrow {...props} />
    )
}

import { PopoverCloseButton as _PopoverCloseButton, PopoverCloseButtonProps as _PopoverCloseButtonProps } from "@chakra-ui/react"
export interface PopoverCloseButtonProps extends _PopoverCloseButtonProps {

}

export function PopoverCloseButton(props: PopoverCloseButtonProps) {
    return (
        <_PopoverCloseButton {...props} />
    )
}

import { PopoverHeader as _PopoverHeader, PopoverHeaderProps as _PopoverHeaderProps } from "@chakra-ui/react"
export interface PopoverHeaderProps extends _PopoverHeaderProps {

}

export function PopoverHeader(props: PopoverHeaderProps) {
    return (
        <_PopoverHeader {...props} />
    )
}

import { PopoverFooter as _PopoverFooter, PopoverFooterProps as _PopoverFooterProps } from "@chakra-ui/react"
export interface PopoverFooterProps extends _PopoverFooterProps {

}

export function PopoverFooter(props: PopoverFooterProps) {
    return (
        <_PopoverFooter {...props} />
    )
}

import { PopoverBody as _PopoverBody, PopoverBodyProps as _PopoverBodyProps } from "@chakra-ui/react"
import { forwardRef } from "react"
import Box from "../box"
export interface PopoverBodyProps extends _PopoverBodyProps {

}

export function PopoverBody(props: PopoverBodyProps) {
    return (
        <_PopoverBody {...props} />
    )
}


export default {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    PopoverHeader,
    PopoverCloseButton,
    PopoverArrow,
    PopoverFooter
}