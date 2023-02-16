import { ClientContext, Obj, ServerContext, useUtilitiesContext } from "@reactive/client"
import { DeleteAlertModal, Stack, StackProps } from "@reactive/ui"
import { useEffect } from "react"

export interface RootLayoutProps extends StackProps {
    children?: any
}

const serverObj = new Obj("__server")

export function RootLayout({ children, ...props }: RootLayoutProps) {
    const { deleteAlertModal } = useUtilitiesContext()
    useEffect(() => {
        init()
    }, [])

    const init = async () => {
        const { endpoints }: any = await serverObj.call("") || {}
        if (endpoints?.length) {
            ServerContext.endpoints = [...endpoints]
        }
    }
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