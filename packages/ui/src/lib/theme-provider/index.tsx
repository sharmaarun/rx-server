import { ChakraProvider as _ChakraProvider, ChakraProviderProps as _ChakraProviderProps } from "@chakra-ui/react"
export interface UIProviderProps extends _ChakraProviderProps {

}

export function UIProvider(props: UIProviderProps) {
    return (
        <_ChakraProvider {...props} />
    )
}

export default UIProvider