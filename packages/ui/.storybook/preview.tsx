import { ChakraProvider } from "../src/chakra-provider"
export const decorators = [
    (story: any) => (
        <ChakraProvider >
            {story()}
        </ChakraProvider>
    )
]