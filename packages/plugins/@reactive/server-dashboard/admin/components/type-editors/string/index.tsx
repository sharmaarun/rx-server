import { AttributeEditorContext } from "@reactive/client"
import { Stack, StackProps } from "@reactive/ui"

export interface StringTypeEditorProps extends StackProps, AttributeEditorContext {
    children?: any
}



export function StringTypeEditor({ children, attribute, ...props }: StringTypeEditorProps) {

    return (
        <Stack {...props}>

        </Stack>
    )
}

export default StringTypeEditor