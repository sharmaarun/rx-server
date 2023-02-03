import React from "react"
import { Outlet, Link } from "react-router-dom"

export const HomePage = () => {
    return (<>
        <Link to="/admin/endpoints">Olas</Link>
        <Outlet />
    </>)
}