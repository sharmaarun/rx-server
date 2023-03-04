import { Field, FieldControl, FieldLabel } from "../form"
import { Input } from "../input"
import { ArrayOfInput, ArrayOfInputProps } from "./index"

export default {
    title: "ArrayOf Input",
    component: ArrayOfInput
}

export const Default = ({ title = "Default", ...args }: ArrayOfInputProps) =>
    <ArrayOfInput title={title} {...args} >
        <FieldControl>
            <FieldLabel>
                Name
            </FieldLabel>
            <Field name="name">
                <Input />
            </Field>
        </FieldControl>
    </ArrayOfInput>
