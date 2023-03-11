import { EntityEditor, EntityEditorFieldsRenderer, EntityEditorProps } from "./index";

export default {
    title: "Entity Editor",
    component: EntityEditor
}

export const Default = (props: EntityEditorProps) =>
    <EntityEditor {...props}>
        <EntityEditorFieldsRenderer entityName="tst" />
    </EntityEditor>