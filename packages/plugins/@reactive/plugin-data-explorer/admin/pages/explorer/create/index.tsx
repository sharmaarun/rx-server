import { StackProps } from "@reactive/ui"
import EditorPage from "../editor"

export interface CreatePageProps extends StackProps {
    children?: any
}

export function CreatePage({ children, ...props }: CreatePageProps) {
    return (
        <EditorPage mode="create" />
    )
}

export default CreatePage