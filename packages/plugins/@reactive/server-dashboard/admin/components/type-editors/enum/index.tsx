import { AttributeEditorContext } from "@reactive/client"
import { Field, FieldControl, FieldLabel, FormStage, HStack, Stack, StackProps, Textarea, TextareaProps } from "@reactive/ui"
import { ChangeEvent, useEffect, useState } from "react"

export interface EnumValueInputProps extends Omit<TextareaProps, "onChange"> {
    value?: string[]
    defaultValue?: string[]
    onChange?: (value: string[]) => void
}

export const EnumValueInput = ({ defaultValue, onChange, value: _, ...props }: EnumValueInputProps) => {
    const onChange_ = (e: any) => {
        const v_ = e.target.value?.split("\n")?.filter((v: string) => v.length) || []
        onChange?.([...v_])
    }
    return (
        <>
            <Textarea minH="32"  {...props} defaultValue={defaultValue?.join("\n")} onChange={onChange_} />
        </>
    )
}

export interface EnumTypeEditorProps extends StackProps, AttributeEditorContext {
    children?: any
}

export function EnumTypeEditor({ children, ...props }: EnumTypeEditorProps) {

    return (
        <FormStage >
            <Stack {...props}>
                <HStack alignItems="flex-start">
                    <FieldControl flex={1}>
                        <FieldLabel>
                            Values
                        </FieldLabel>
                        <Field name="values">
                            {/* <Textarea placeholder={"Enter one value per line"} /> */}
                            <EnumValueInput placeholder={"Enter one value per line"} />
                        </Field>
                    </FieldControl>
                </HStack>
            </Stack>
        </FormStage>
    )
}

export default EnumTypeEditor