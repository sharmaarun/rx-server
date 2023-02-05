import { useClientContext } from "@reactive/client";
import { Box, ChakraProvider } from "@reactive/ui";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RootLayout from "../layouts/root";
import { HomePage } from "./index";

// registerRoute(ctx => ({
//     title: "Admin",
//     path: "/",
//     element: <HomePage />
// }))

// const router = createBrowserRouter()

function App() {
    const { routes } = useClientContext()

    const routes_ = routes?.routes?.filter(r => r?.path?.length).map(r => ({
        path: r.path,
        element: r.element
    }))
    console.log(routes_)
    return <ChakraProvider>
        <Box>ola</Box>
        <RootLayout>
            <BrowserRouter>
                <Routes>
                    {routes_?.length && <>
                        <Route path={"/admin"} element={<HomePage />} >
                            {
                                routes_.map((r, ind) => {
                                    const Ele = r.element || (() => <></>)
                                    return <Route key={ind} path={"/admin" + (r.path)} element={<Ele />} />
                                })
                            }
                        </Route>
                    </>
                    }
                </Routes>
            </BrowserRouter>
            {/* {routes_.map((r, ind) => {
                const Ele = r.element || (() => <></>)
                return <Ele key={ind} />
            })} */}
        </RootLayout>
    </ChakraProvider>
}
export default App

