import React from "react"
import { Box, BoxProps } from "@reactive/ui"
import { ValueRendererContext } from "@reactive/client"

export interface UUIDValueRendererProps extends BoxProps, ValueRendererContext {
     children?:any
}

export function UUIDValueRenderer({children, ...props}: UUIDValueRendererProps) {
    return (
        <Box {...props}>
            {children}
        </Box>
    )
}

export default UUIDValueRenderer