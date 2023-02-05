import React from "react"
import { Box as _Box, BoxProps as _BoxProps } from "@chakra-ui/react"
export interface BoxProps extends _BoxProps {

}

export function Box(props: BoxProps) {
    return (
        <_Box {...props} />
    )
}

export default Box