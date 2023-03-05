import { RichTextEditor, RichTextEditorProps } from "./index"
export default {
    title: "Rich Text Editor",
    component: RichTextEditor
}

export const Default = (props: RichTextEditorProps) => <RichTextEditor
    onChange={console.log}
    {...props}
/>
