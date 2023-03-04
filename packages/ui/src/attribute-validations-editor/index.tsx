import { BasicAttributeValidation, toPascalCase } from "@reactive/commons"
import React from "react"
import { ArryOfInput } from "../array-of-input"
import { Checkbox } from "../checkbox"
import { Field, FieldControl, FieldDescription, FieldLabel } from "../form"
import { Input } from "../input"
import { Select, SelectOption } from "../select"
import { HStack, Stack, StackProps } from "../stack"

export interface AttributeValidationsEditorProps extends StackProps {
    children?: any
}

export function AttributeValidationsEditor({ children, ...props }: AttributeValidationsEditorProps) {
    return (
        <Stack {...props}>
            <FieldLabel>
                Validations
            </FieldLabel>
            <Field name="validations">
                <ArryOfInput title="Validation" renderer={v => <>{v.type}:{v.value}</>} titleKey="type">
                    <FieldControl>
                        <FieldLabel>
                            Validation Type
                        </FieldLabel>
                        <Field name="type">
                            <Select>
                                <SelectOption >{"--Select--"}</SelectOption>
                                {Object.keys(BasicAttributeValidation).map((v, ind) =>
                                    <SelectOption key={ind} value={v}>{toPascalCase(v)}</SelectOption>
                                )}
                            </Select>
                        </Field>
                    </FieldControl>
                    <FieldControl>
                        <FieldLabel>
                            Value
                        </FieldLabel>
                        <Field name="value">
                            <Input />
                        </Field>
                    </FieldControl>
                </ArryOfInput>
            </Field>
        </Stack>
    )
}

export default AttributeValidationsEditor