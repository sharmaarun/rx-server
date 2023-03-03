import React from "react"
import { Select, SelectOption, SelectProps } from "@reactive/ui"
import { ValueEditorContext } from "@reactive/client"

export interface EnumValueEditorProps extends SelectProps, ValueEditorContext {
    children?: any
}

export function EnumValueEditor({ children, attribute, ...props }: EnumValueEditorProps) {
    const { values } = attribute || {}
    return (
        <Select {...props}>
            {values?.map((v, ind) =>
                <SelectOption value={v} key={ind}>{v}</SelectOption>
            )}
        </Select>
    )
}

export default EnumValueEditor