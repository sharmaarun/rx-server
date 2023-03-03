import React from "react"
import { Switch, SwitchProps } from "@reactive/ui"
import { ValueEditorContext } from "@reactive/client"

export interface BooleanValueEditorProps extends SwitchProps, ValueEditorContext {
    children?: any
}

export function BooleanValueEditor({ children, ...props }: BooleanValueEditorProps) {
    return (
        <Switch {...props} />
    )
}

export default BooleanValueEditor