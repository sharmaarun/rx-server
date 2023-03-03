import React from "react"
import { Input, InputProps } from "@reactive/ui"
import { ValueEditorContext } from "@reactive/client"

export interface StringValueEditorProps extends InputProps, ValueEditorContext {
     children?:any
}

export function StringValueEditor({children, ...props}: StringValueEditorProps) {
    return (
        <Input {...props}>
            {children}
        </Input>
    )
}

export default StringValueEditor