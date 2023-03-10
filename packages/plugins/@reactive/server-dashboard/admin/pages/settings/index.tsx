import { useRoutes } from "@reactive/client"
import { Stack, StackProps } from "@reactive/ui"
import { Outlet, Route, Routes } from "react-router-dom"
import SettingsLayout from "../../layouts/settings"
import { buildRouter } from "../../utils"

export interface SettingsPageProps extends StackProps {
    children?: any
}

export function SettingsPage({ children, ...props }: SettingsPageProps) {
    const { settingsRoutes } = useRoutes()
    console.log(settingsRoutes)
    return (
        <Stack>
            <SettingsLayout>
                <Routes>
                    {buildRouter(settingsRoutes as any)}
                </Routes>
            </SettingsLayout>
        </Stack>
    )
}

export default SettingsPage