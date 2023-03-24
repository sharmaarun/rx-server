import { AttributeEditorContext, DefaultAttributesValidationClass } from "@reactive/client"
import { MediaType, toPascalCase } from "@reactive/commons"
import { Field, FieldControl, FieldDescription, FieldLabel, Form, FormStage, HStack, Input, InputProps, Select, SelectOption, StackProps, useFormContext } from "@reactive/ui"

export interface MediaAttributeEditorProps extends StackProps, AttributeEditorContext {
    children?: any
}


class MediaAttributeValidation extends DefaultAttributesValidationClass {
}

export const MediaTypes = {
    [MediaType.image]: {
        title: ""
    }
}

export function MediaAttributeEditor({ children, attribute, ...props }: MediaAttributeEditorProps) {
    const { defaultValue } = useFormContext()

    return (
        <FormStage onSubmit={console.log} {...props} validationClass={MediaAttributeValidation}>
            <HStack alignItems="flex-start">
                <FieldControl>
                    <FieldLabel>Name</FieldLabel>
                    <Field name="name">
                        <Input isDisabled={defaultValue?.name?.length} />
                    </Field>
                    <FieldDescription>Enter a unique name</FieldDescription>
                </FieldControl>
            </HStack>
            <Field name="meta">
                <MediaAttributeMetaEditor />
            </Field>
        </FormStage>
    )
}


export interface MediaAttributeMetaEditorProps extends InputProps {
    children?: any
}

export function MediaAttributeMetaEditor({ children, ...props }: MediaAttributeMetaEditorProps) {

    return (
        <Form onFormChange={props.onChange} defaultValue={props.value || { type: Object.values(MediaType)?.[0] }}>
            <FieldControl>
                <FieldLabel>Type</FieldLabel>
                <Field name="type" >
                    <Select>
                        {Object.values(MediaType).map((sast, ind) =>
                            <SelectOption key={ind} value={sast}>
                                {toPascalCase(sast)}
                            </SelectOption>
                        )}
                    </Select>
                </Field>
            </FieldControl>
        </Form>
    )
}