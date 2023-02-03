import { Tag as _Tag, TagProps as _TagProps } from "@chakra-ui/react"
import { forwardRef } from "react"
export interface TagProps extends _TagProps {

}

export const Tag = forwardRef((props: TagProps, ref: any) => {
    return (
        <_Tag {...props} ref={ref} />
    )
})

import { TagLabel as _TagLabel, TagLabelProps as _TagLabelProps } from "@chakra-ui/react"
export interface TagLabelProps extends _TagLabelProps {

}

export function TagLabel(props: TagLabelProps) {
    return (
        <_TagLabel {...props} />
    )
}

import { TagCloseButton as _TagCloseButton, TagCloseButtonProps as _TagCloseButtonProps } from "@chakra-ui/react"
export interface TagCloseButtonProps extends _TagCloseButtonProps {

}

export function TagCloseButton(props: TagCloseButtonProps) {
    return (
        <_TagCloseButton {...props} />
    )
}

import { TagLeftIcon as _TagLeftIcon, IconProps as _TagIconProps } from "@chakra-ui/react"
export interface TagLeftIconProps extends _TagIconProps {

}

export function TagLeftIcon(props: TagLeftIconProps) {
    return (
        <_TagLeftIcon {...props} />
    )
}

import { TagRightIcon as _TagRightIcon } from "@chakra-ui/react"
export interface TagRightIconProps extends _TagIconProps {

}

export function TagRightIcon(props: TagRightIconProps) {
    return (
        <_TagRightIcon {...props} />
    )
}



export default {
    Tag,
    TagRightIcon,
    TagLeftIcon,
    TagCloseButton,
    TagLabel
}