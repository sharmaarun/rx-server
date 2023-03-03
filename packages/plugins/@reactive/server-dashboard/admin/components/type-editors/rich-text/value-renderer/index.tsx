import React from "react"
import { Box, BoxProps } from "@reactive/ui"
import { ValueRendererContext } from "@reactive/client"

export interface RichTextValueRendererProps extends BoxProps, ValueRendererContext {
     children?:any
}

export function RichTextValueRenderer({children, ...props}: RichTextValueRendererProps) {
    return (
        <Box {...props}>
            {children}
        </Box>
    )
}

export default RichTextValueRenderer