import React from "react"
import { Box, BoxProps } from "@reactive/ui"
import { ValueRendererContext } from "@reactive/client"

export interface DateValueRendererProps extends BoxProps, ValueRendererContext {
    children?: any
}

export function DateValueRenderer({ children, ...props }: DateValueRendererProps) {
    return (
        <Box {...props}>
            {children}
        </Box>
    )
}

export default DateValueRenderer