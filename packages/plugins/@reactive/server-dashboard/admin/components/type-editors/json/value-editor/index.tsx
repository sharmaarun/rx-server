import React from "react"
import { Textarea, TextareaProps } from "@reactive/ui"
import { ValueEditorContext } from "@reactive/client"

export interface JSONValueEditorProps extends TextareaProps, ValueEditorContext {
     children?:any
}

export function JSONValueEditor({children, ...props}: JSONValueEditorProps) {
    return (
        <Textarea {...props}>
            {children}
        </Textarea>
    )
}

export default JSONValueEditor