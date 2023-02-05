import React from "react"
import { ChakraProvider as _ChakraProvider, ChakraProviderProps as _ChakraProviderProps } from "@chakra-ui/react"
export interface ChakraProviderProps extends _ChakraProviderProps {

}

export function ChakraProvider(props: ChakraProviderProps) {
    return (
        <_ChakraProvider {...props} />
    )
}

export default ChakraProvider