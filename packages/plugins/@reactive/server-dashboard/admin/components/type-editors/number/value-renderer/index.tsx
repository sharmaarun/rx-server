import React from "react"
import { Box, BoxProps } from "@reactive/ui"
import { ValueRendererContext } from "@reactive/client"

export interface NumberValueRendererProps extends BoxProps, ValueRendererContext {
     children?:any
}

export function NumberValueRenderer({children, ...props}: NumberValueRendererProps) {
    return (
        <Box {...props}>
            {children}
        </Box>
    )
}

export default NumberValueRenderer