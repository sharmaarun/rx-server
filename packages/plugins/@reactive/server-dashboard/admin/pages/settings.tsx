import { StackProps } from "@reactive/ui"
import { SettingsLayout } from "../layouts/settings"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useRoutes } from "@reactive/client"

export interface SettingsPageProps extends StackProps {
    children?: any
}

export function SettingsPage({ children, ...props }: SettingsPageProps) {
    const { settingsRoutes } = useRoutes()
    const { pathname } = useLocation()
    const navigate = useNavigate()
    useEffect(() => {
        if (pathname === "/admin/settings") {
            navigate("/admin/settings/" + settingsRoutes?.[0]?.path,{replace:true})
        }
    }, [pathname])
    return (
        <SettingsLayout>
            <Outlet />
        </SettingsLayout>
    )
}

export default SettingsPage