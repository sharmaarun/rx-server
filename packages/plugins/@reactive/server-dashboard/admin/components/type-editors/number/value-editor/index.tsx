import { ValueEditorContext } from "@reactive/client"
import { NumberInput, NumberInputProps } from "@reactive/ui"

export interface NumberValueEditorProps extends NumberInputProps, ValueEditorContext {
    children?: any
}

export function NumberValueEditor({ children, ...props }: NumberValueEditorProps) {
    return (
        <NumberInput {...props} />
    )
}

export default NumberValueEditor