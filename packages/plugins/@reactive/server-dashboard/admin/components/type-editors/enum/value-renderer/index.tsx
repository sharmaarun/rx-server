import React from "react"
import { Box, BoxProps } from "@reactive/ui"
import { ValueRendererContext } from "@reactive/client"

export interface EnumValueRendererProps extends BoxProps, ValueRendererContext {
    children?: any
}

export function EnumValueRenderer({ children, ...props }: EnumValueRendererProps) {
    return (
        <Box {...props}>
            {children}
        </Box>
    )
}

export default EnumValueRenderer