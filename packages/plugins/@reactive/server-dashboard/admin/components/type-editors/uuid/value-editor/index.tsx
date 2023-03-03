import React from "react"
import { Input, InputProps } from "@reactive/ui"
import { ValueEditorContext } from "@reactive/client"

export interface UUIDValueEditorProps extends InputProps, ValueEditorContext {
    children?: any
}

export function UUIDValueEditor({ children, ...props }: UUIDValueEditorProps) {
    return (
        <Input {...props} />
    )
}

export default UUIDValueEditor