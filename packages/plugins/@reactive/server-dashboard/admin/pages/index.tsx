import { Link, Outlet } from "react-router-dom"
import AdminLayout from "../layouts/router"

export const HomePage = () => {
    return (
        <AdminLayout>
            <Outlet />
        </AdminLayout>)
}