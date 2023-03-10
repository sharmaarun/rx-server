import { ClientContext, registerAttributeType, registerNetworkMiddleware, registerNetworkResponseMiddleware, registerPlugin, registerRootRoute, registerSettingsRoute } from "@reactive/client"
import { RXICO_ENVELOP, RXICO_EYE, RXICO_FOLDER, RXICO_USER_LOCK } from "@reactive/icons"
import { extractAuthTokenFromCookies } from "./utils"

import { BaseAttributeType, getCookie, StringAttributeSubType } from "@reactive/commons"
import { Input, useToast } from "@reactive/ui"
import LoginPage from "./pages/login"
import RegisterPage from "./pages/register"
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import RolesPage from "./pages/roles"



registerRootRoute(ctx => ({
    title: "Authentication/Login",
    path: "/login",
    element: () => <LoginPage />
    ,
    icon: () => <RXICO_FOLDER />,
}))

registerRootRoute(ctx => ({
    title: "Authentication/Register",
    path: "/register",
    element: RegisterPage,
    icon: () => <RXICO_FOLDER />,
}))

registerSettingsRoute(ctx => ({
    title: "Roles",
    element: RolesPage,
    icon: () => <RXICO_USER_LOCK />,
    path: "roles"
}))

registerAttributeType(ctx => ({
    attribute: {
        type: BaseAttributeType.string,
        subType: StringAttributeSubType.varchar,
        customType: "password"
    },
    metadata: {
        components: {
            valueEditor: {
                span: 6,
                component: props => <Input placeholder="Leave unchanged for no password update" type="password" {...props} />
            }
        },
        icon: () => <RXICO_EYE />
    }
}))

registerAttributeType(ctx => ({
    attribute: {
        type: BaseAttributeType.string,
        subType: StringAttributeSubType.varchar,
        customType: "email"
    },
    metadata: {
        components: {
            valueEditor: {
                span: 6,
                component: props => <Input placeholder="eg: someone@site.domain" type="email" {...props} />
            }
        },
        icon: () => <RXICO_ENVELOP />
    }
}))

registerNetworkMiddleware((ctx) => ({
    name: "APPEND_AUTHROIZATION_HEADERS",
    fn(path, opts) {
        opts.headers = {
            ...(opts.headers || {}),
            Authorization: getCookie("_t")
        }
    }
}))


registerPlugin(() => (ctx: ClientContext) => {
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const toast = useToast({
        status: "error",
        title: "Error",
        position: "top"
    })

    useEffect(() => {
        registerNetworkResponseMiddleware((ctx) => ({
            name: "PROCESS UNAUTHORIZED ERROR",
            fn(path, opts) {
                console.log(path)
                if (opts.status === 401 && opts?.statusText?.toLowerCase()?.includes("unauthorized")) {
                    // toast({ description: "Please login" })
                    navigate("/login")
                }
            }
        }))
    }, [])

    useEffect(() => {

        // redirect to login page if not already logged int
        const token = extractAuthTokenFromCookies()
        if (!token && window.location.pathname?.startsWith("/admin")) {
            navigate("/login")
        }
    }, [pathname])
})

