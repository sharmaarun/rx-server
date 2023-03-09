import { ClientContext, Obj, PluginClass, ServerContext, useClientContext, useUtilitiesContext } from "@reactive/client"
import { DeleteAlertModal, Spinner, Stack, StackProps } from "@reactive/ui"
import { useEffect, useState } from "react"
import { Navigator, useLocation, useNavigate } from "react-router-dom"

export interface RootLayoutProps extends StackProps {
    children?: any
    navigator?: Navigator
}

const serverObj = new Obj("__server")
let tids: any = {
    init: -1
}
let pluginsLoaded = false;
export function RootLayout({ children, ...props }: RootLayoutProps) {
    const { deleteAlertModal } = useUtilitiesContext()
    const ctx = useClientContext()
    const { plugins: { plugins }, routes } = ctx || {}
    const navigate = useNavigate()
    const location = useLocation()
    const [loading, setLoading] = useState(true)


    const init = async () => {
        const { endpoints }: any = await serverObj.call("") || {}
        if (endpoints?.length) {
            ServerContext.endpoints = [...endpoints]
        }
    }
    useEffect(() => {
        init()
        setTimeout(() => setLoading(false), 100)
    }, [])

    // creat context

    // for each plugin, call it's init method
    for (let plugin of plugins) {
        if ((plugin as PluginClass).init) {
            (plugin as PluginClass).init(ctx as any)
        } else {
            (plugin as any)?.(ctx);
        }
    }



    // }, [plugins])

    if (loading) return <Spinner />
    return (
        <>
            <DeleteAlertModal
                {...deleteAlertModal}
            />
            <Stack bg="gray.50" spacing={0} {...props}>
                {children}
            </Stack>
        </>
    )
}

export default RootLayout