import { ValueEditorContext } from "@reactive/client"
import { RichTextEditor, RichTextEditorProps } from "@reactive/ui"

export interface RichTextValueEditorProps extends ValueEditorContext {
    children?: any
    defaultValue?: string
    onChange?: (value: string) => void
}

export function RichTextValueEditor({ children, onChange, defaultValue, ...props }: RichTextValueEditorProps) {

    const onChange_ = (value: any) => onChange?.(JSON.stringify(value))
    const defaultValue_ = defaultValue ? JSON.parse(defaultValue) : defaultValue

    return (
        <RichTextEditor onChange={onChange_} defaultValue={defaultValue_} {...props} />
    )
}

export default RichTextValueEditor