
import { getRegisteredAttribute, sortAttributesBySpan, useServerContext } from "@reactive/client"
import { Attribute, BaseAttributeType, EntitySchema, NumberAttributeSubType, toPascalCase } from "@reactive/commons"
import { Box, Field, FieldControl, FieldLabel, Form, FormProps, getFormFieldTypeForAttribute, HStack, HStackProps, Input } from "../index"



export interface EntityEditorProps extends FormProps {
    children?: any
}

export function EntityEditor(props: EntityEditorProps) {
    const { children } = props || {}

    return (
        <Form
            {...props}
        >
            {children}
        </Form>
    )
}

export interface EntityEditorFieldsRendererProps extends HStackProps {
    entityName: string
    mode?: "create" | "update"
}

export function EntityEditorFieldsRenderer({ entityName, mode = "create", ...props }: EntityEditorFieldsRendererProps) {
    const { endpoints } = useServerContext()
    const schema: EntitySchema = endpoints?.find(e => e.name === entityName)?.schema as any
    return (
        <HStack flexWrap="wrap" spacing={0} alignItems="flex-start" justifyContent="space-between" {...props}>
            {sortAttributesBySpan(Object.values((schema?.attributes as any) || {})).
                filter(attr => (!attr.private! && !attr.hidden!)).
                map((attr, ind) => {
                    const rattr = getRegisteredAttribute(attr)
                    const { valueEditor } = rattr?.metadata?.components || {}
                    const { component: ValueEditor = Input, span = 6 } = valueEditor || {}

                    return <FieldControl py={2} key={ind} w={["full", "full", (((span / 12) * 100) - 1) + "%"]}>
                        <FieldLabel>{toPascalCase(attr?.name)}</FieldLabel>
                        <Box pos="relative">
                            {mode === "update" && attr.editable === false ? <Box
                                pos="absolute"
                                zIndex="1"
                                left="0" right="0" bottom="0" top="0"
                            /> : ""}
                            <Field zIndex={10} name={attr?.name} type={getFormFieldTypeForAttribute(attr)}>
                                <ValueEditor
                                    isDisabled={mode === "update" && attr.editable === false}
                                    attribute={attr}
                                    schema={schema as any}
                                    autoFocus={ind === 0}
                                />
                            </Field>
                        </Box>
                    </FieldControl>
                }
                )}
        </HStack>
    )
}

