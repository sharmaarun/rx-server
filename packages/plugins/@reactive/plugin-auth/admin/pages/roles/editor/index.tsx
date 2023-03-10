import React from "react"
import { Page, PageProps } from "@reactive/ui"
import { useParams } from "react-router-dom"

export interface RolesEditorPageProps extends PageProps {
    children?: any
}

export function RolesEditorPage({ children, ...props }: RolesEditorPageProps) {
    const { id } = useParams()
    return (
        <div>{id ? "edit" : "new"}</div>
    )
}

export default RolesEditorPage