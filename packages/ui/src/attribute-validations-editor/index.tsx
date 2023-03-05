import { BasicAttributeValidation, BasicAttributeValidationType, toPascalCase } from "@reactive/commons"
import { IsNotEmpty } from "class-validator"
import { ReactNode } from "react"
import { ArrayOfInput } from "../array-of-input"
import { Field, FieldControl, FieldLabel, useFormContext } from "../form"
import { Input } from "../input"
import NumberInput from "../number-input"
import { Select, SelectOption } from "../select"
import { HStack, StackProps } from "../stack"
import { Tag } from "../tag"
import { Text } from "../text"

export interface AttributeValidationsEditorProps extends StackProps {
    value?: any
    defaultValue?: any
    onChange?: (val: any) => void
    children?: any
}

export type CustomBasicAttributeValidationType = Partial<BasicAttributeValidationType> & {
    title?: string
    valueEditor?: ((opts: CustomBasicAttributeValidationType) => ReactNode)
}

export const BasicAttributeValidations: CustomBasicAttributeValidationType[] = [
    {
        title: "Contains",
        type: BasicAttributeValidation.contains,
        valueEditor: (props: any) => <Field name="value">
            <Input {...props} />
        </Field>
    },
    {
        title: "Min Value",
        type: BasicAttributeValidation.min,
        valueEditor: (props: any) => <Field name="value" type="number">
            <NumberInput {...props} />
        </Field>
    },
    {
        title: "Max Value",
        type: BasicAttributeValidation.max,
        valueEditor: (props: any) => <Field name="value" type="number">
            <NumberInput {...props} />
        </Field>
    },
    {
        title: "Min Length",
        type: BasicAttributeValidation.minLen,
        valueEditor: (props: any) => <Field name="value" type="number">
            <NumberInput {...props} />
        </Field>
    },
    {
        title: "Max Length",
        type: BasicAttributeValidation.maxLen,
        valueEditor: (props: any) => <Field name="value" type="number">
            <NumberInput {...props} />
        </Field>
    },
    {
        title: "Matches Regular Expression",
        type: BasicAttributeValidation.matches,
        valueEditor: (props: any) => <Field name="value">
            <Input {...props} />
        </Field>
    },
]

export class AttributeValidationsEditorValidationClass {
    @IsNotEmpty({ message: "Please choose at least one" })
    type!: string
    @IsNotEmpty({ message: "Can't be empty" })
    value!: string
}

export function AttributeValidationsEditorForm({ }: AttributeValidationsEditorProps) {
    const { value } = useFormContext()
    return (
        <>
            <FieldControl>
                <FieldLabel>
                    Validation Type
                </FieldLabel>
                <Field name="type">
                    <Select>
                        <SelectOption value="" >{"--Select--"}</SelectOption>
                        {BasicAttributeValidations.map((v, ind) =>
                            <SelectOption key={ind} value={v.type}>{v.title || toPascalCase(v.type || "")}</SelectOption>
                        )}
                    </Select>
                </Field>
            </FieldControl>
            {value?.type?.length ?
                <FieldControl>
                    <FieldLabel>
                        Value
                    </FieldLabel>

                    {BasicAttributeValidations.find(bav => bav.type === value?.type)?.valueEditor?.({})}
                </FieldControl>
                : ""}
        </>
    )
}

const ValueRenderer = (v: BasicAttributeValidationType) => {
    const v_ = BasicAttributeValidations.find(bav => bav.type === v.type)
    return <HStack
        alignItems="flex-start"
        justifyContent="flex-start"
    >
        <Text fontWeight="semibold">
            {v_?.title} :
        </Text>
        <Tag colorScheme="purple">
            {v.value}
        </Tag>
    </HStack >
}

export function AttributeValidationsEditor({ children, ...props }: AttributeValidationsEditorProps) {
    return (
        <ArrayOfInput title="Validation" renderer={ValueRenderer} titleKey="type" validationClass={AttributeValidationsEditorValidationClass} {...props}>
            <AttributeValidationsEditorForm />
        </ArrayOfInput>
    )
}

export default AttributeValidationsEditor