import { ValueEditorContext } from "@reactive/client"
import { JSONInput, JSONInputProps } from "@reactive/ui"
import { useState } from "react"

export interface JSONValueEditorProps extends JSONInputProps, ValueEditorContext {
    children?: any
}

export function JSONValueEditor({ children, ...props }: JSONValueEditorProps) {
    const [error, setError] = useState(false)
    const onChange = (code: string) => {
        setError(false)
        try {
            // check if valid json
            JSON.parse(code)
            //if yes, call onChange
            props?.onChange?.(code)

        } catch (e) {
            // else set error
            setError(true)
        }
    }
    return (
        <JSONInput minH="32" maxH="48" {...props} onChange={onChange} {...(error ? { borderColor: "red.500" } : {})} >
            {children}
        </JSONInput>
    )
}

export default JSONValueEditor