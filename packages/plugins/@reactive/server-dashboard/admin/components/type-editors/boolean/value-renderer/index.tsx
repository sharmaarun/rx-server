import React from "react"
import { Box, BoxProps } from "@reactive/ui"
import { ValueRendererContext } from "@reactive/client"

export interface BooleanValueRendererProps extends BoxProps, ValueRendererContext {
     children?:any
}

export function BooleanValueRenderer({children, ...props}: BooleanValueRendererProps) {
    return (
        <Box {...props}>
            {children}
        </Box>
    )
}

export default BooleanValueRenderer