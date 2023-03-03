import React from "react"
import { Box, BoxProps } from "@reactive/ui"
import { ValueRendererContext } from "@reactive/client"

export interface RelationValueRendererProps extends BoxProps, ValueRendererContext {
    children?: any
}

export function RelationValueRenderer({ children, ...props }: RelationValueRendererProps) {
    return (
        <Box {...props}>
            {children}
        </Box>
    )
}

export default RelationValueRenderer