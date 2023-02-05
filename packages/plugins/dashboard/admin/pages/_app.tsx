import { ChakraProvider } from "@reactive/ui";
import RootLayout from "../layouts/root";
import RouterLayout from "../layouts/router";

function App() {
    return (
        <ChakraProvider>
            <RootLayout>
                <RouterLayout />
            </RootLayout>
        </ChakraProvider>
    )
}
export default App

