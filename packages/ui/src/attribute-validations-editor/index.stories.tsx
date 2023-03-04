import { AttributeValidationsEditor, AttributeValidationsEditorProps } from "./index"

export default {
    title: "Attribute Validations Editor Input",
    component: AttributeValidationsEditor
}

export const Default = ({ title = "Default", ...args }: AttributeValidationsEditorProps) =>
    <AttributeValidationsEditor />
