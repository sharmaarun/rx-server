import { Icon as _Icon, IconButton as _IconButton, IconButtonProps as _IconButtonProps, IconProps as _IconProps } from "@chakra-ui/react"
import React, { forwardRef } from "react"

export interface IconProps extends _IconProps {

}

export const Icon = forwardRef((props: IconProps, ref: any) => {
    return (
        <_Icon ref={ref} w="24px" h="24px" {...props} />
    )
})

export interface IconButtonProps extends _IconButtonProps {

}

export const IconButton = forwardRef((props: IconButtonProps, ref: any) => {
    return (
        <_IconButton variant="ghost" ref={ref} {...props} />
    )
})

export default Icon