import { ChakraProvider, withDefaultColorScheme, extendTheme, withDefaultProps } from "@reactive/ui";
import RootLayout from "../layouts/root";
import RouterLayout from "../layouts/router";

function App() {
    return (
        <ChakraProvider theme={extendTheme(
            withDefaultColorScheme({
                colorScheme: "purple"
            }),
            withDefaultProps({
                defaultProps: {
                    "variant":"outline"
                },
                components:["Button"]
            })
        )}>
            <RootLayout>
                <RouterLayout />
            </RootLayout>
        </ChakraProvider>
    )
}
export default App

