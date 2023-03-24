import React, { forwardRef } from "react"
import { Box as _Box, BoxProps as _BoxProps } from "@chakra-ui/react"
export interface BoxProps extends _BoxProps {

}

export const Box = forwardRef((props: BoxProps, ref: any) => {
    return (
        <_Box {...props} ref={ref} />
    )
})

export default Box