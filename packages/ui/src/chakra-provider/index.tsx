import React from "react"
import { ChakraProvider as _ChakraProvider, ChakraProviderProps as _ChakraProviderProps } from "@chakra-ui/react"
import { ChakraDefaultTheme } from "../utils/themes"
export interface ChakraProviderProps extends _ChakraProviderProps {

}

export function ChakraProvider(props: ChakraProviderProps) {
    return (
        <_ChakraProvider theme={ChakraDefaultTheme} {...props} />
    )
}

export default ChakraProvider