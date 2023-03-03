import React from "react"
import { Input, InputProps } from "@reactive/ui"
import { ValueEditorContext } from "@reactive/client"

export interface NumberValueEditorProps extends InputProps, ValueEditorContext {
    children?: any
}

export function NumberValueEditor({ children, ...props }: NumberValueEditorProps) {
    return (
        <Input type="number" {...props}>
            {children}
        </Input>
    )
}

export default NumberValueEditor