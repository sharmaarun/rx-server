import React from "react"
import { Box, BoxProps } from "@reactive/ui"
import { ValueRendererContext } from "@reactive/client"

export interface JSONValueRendererProps extends BoxProps, ValueRendererContext {
     children?:any
}

export function JSONValueRenderer({children, ...props}: JSONValueRendererProps) {
    return (
        <Box {...props}>
            {children}
        </Box>
    )
}

export default JSONValueRenderer