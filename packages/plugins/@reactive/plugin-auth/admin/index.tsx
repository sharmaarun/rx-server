import { ClientContext, registerAttributeType, registerNetworkMiddleware, registerNetworkResponseMiddleware, registerPlugin, registerRootRoute, registerSettingsMenuItem, registerSettingsRoute } from "@reactive/client"
import { RXICO_ENVELOP, RXICO_EYE, RXICO_FOLDER, RXICO_LOGOUT, RXICO_USER_LOCK } from "@reactive/icons"
import { extractAuthTokenFromCookies, removeAuthToken } from "./utils"

import { BaseAttributeType, getCookie, StringAttributeSubType } from "@reactive/commons"
import { Input, useToast } from "@reactive/ui"
import { useEffect } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import APiPermissionInput from "./components/api-permissions-input"
import LoginPage from "./pages/login"
import RegisterPage from "./pages/register"
import RolesPage from "./pages/roles"
import RolesEditorPage from "./pages/roles/editor"



registerRootRoute(ctx => ({
    title: "Authentication/Login",
    path: "/login",
    element: () => <LoginPage />
    ,
    icon: () => <RXICO_FOLDER />,
}))

registerRootRoute(ctx => ({
    title: "Auth :: Register",
    path: "/register",
    element: RegisterPage,
    icon: () => <RXICO_FOLDER />,
}))

registerSettingsRoute(ctx => ({
    title: "Roles",
    element: Outlet,
    icon: () => <RXICO_USER_LOCK />,
    path: "roles",
    children: [
        {
            title: "Roles Editor",
            element: RolesPage,
            icon: () => <RXICO_USER_LOCK />,
            path: "",
        },
        {
            title: "Add New Role",
            element: RolesEditorPage,
            icon: () => <RXICO_USER_LOCK />,
            path: "new",
        },
        {
            title: "Edit existing role",
            element: RolesEditorPage,
            icon: () => <RXICO_USER_LOCK />,
            path: ":id",
        }
    ]
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

registerAttributeType(ctx => ({
    attribute: {
        type: BaseAttributeType.json,
        customType: "api-permissions"
    },
    metadata: {
        components: {
            valueEditor: {
                span: 12,
                component: (props: any) => <APiPermissionInput {...props} />
            }
        },
        icon: () => <RXICO_EYE />,
        private: true
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


registerSettingsMenuItem(ctx => ({
    name: "logout",
    icon: RXICO_LOGOUT,
    onClick: () => {
        removeAuthToken()
        window.location.href = "/login"
    },
    title: "Logout",
}))
