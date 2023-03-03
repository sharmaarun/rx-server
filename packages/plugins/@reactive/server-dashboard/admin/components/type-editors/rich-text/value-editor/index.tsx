import React from "react"
import { Textarea, TextareaProps } from "@reactive/ui"
import { ValueEditorContext } from "@reactive/client"

export interface RichTextValueEditorProps extends TextareaProps, ValueEditorContext {
    children?: any
}

export function RichTextValueEditor({ children, ...props }: RichTextValueEditorProps) {
    return (
        <Textarea {...props} />
    )
}

export default RichTextValueEditor