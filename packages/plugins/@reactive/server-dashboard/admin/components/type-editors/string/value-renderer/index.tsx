import React from "react"
import { Box, BoxProps } from "@reactive/ui"
import { ValueRendererContext } from "@reactive/client"

export interface StringValueRendererProps extends BoxProps, ValueRendererContext {
     children?:any
}

export function StringValueRenderer({children, ...props}: StringValueRendererProps) {
    return (
        <Box {...props}>
            {children}
        </Box>
    )
}

export default StringValueRenderer