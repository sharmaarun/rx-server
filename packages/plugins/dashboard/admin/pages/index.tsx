import { Link, Outlet } from "react-router-dom"

export const HomePage = () => {
    return (<>
        <Link to="/admin/endpoints">Osa</Link>
        <Outlet />
    </>)
}