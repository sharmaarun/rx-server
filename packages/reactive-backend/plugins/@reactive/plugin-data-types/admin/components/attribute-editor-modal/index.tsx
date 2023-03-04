import "reflect-metadata"
//
import { AttributeEditorContext, DefaultAttributesValidationClass, useAttributes } from "@reactive/client"
import { BasicAttributeValidation, EntitySchema, Attribute, toPascalCase } from "@reactive/commons"
import { Box, Button, Card, Checkbox, Field, FieldControl, FieldDescription, FieldLabel, Form, FormBackButton, FormModal, FormModalProps, FormProps, FormStage, FormSubmitButton, HStack, Icon, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, SelectOption, Stack, StackProps, Text, Tooltip, useDisclosure, useFormModal } from "@reactive/ui"
import { IsNotEmpty } from "class-validator"
import { useState } from "react"
import { RXICO_EDIT, RXICO_PLUS, RXICO_TRASH } from "@reactive/icons"

export interface AttributeEditorModalProps extends Omit<FormModalProps, "children"> {
    attribute?: Attribute
    schema?: EntitySchema
    onSubmit?: (field: Attribute) => void
}

export class NameValidationDTO extends DefaultAttributesValidationClass {
}


export function AttributeEditorModal({ attribute, onSubmit, schema, middlewares, errors, ...props }: AttributeEditorModalProps) {
    const { attributes } = useAttributes()
    const regAttr = attributes.find(rf => rf.attribute.customType === attribute?.customType)
    const CustomTypeEditor = regAttr?.metadata.components?.attributeEditor
    return (
        <Modal size="3xl" {...props} >
            <AttributeEditorContext.Provider value={{ attribute, schema }}>
                <ModalOverlay />
                <Form onSubmit={v => {
                    onSubmit?.(v as any)
                    props?.onClose?.()
                }
                }
                    errors={errors}
                    middlewares={middlewares}
                    defaultValue={attribute}
                >
                    <ModalContent>
                        <ModalHeader>
                            <ModalCloseButton />
                            {toPascalCase(regAttr?.attribute?.customType || "")}
                        </ModalHeader>
                        <ModalBody>
                            <Field hidden name="type" defaultValue={regAttr?.attribute.type}>
                                <Input value={regAttr?.attribute.type} />
                            </Field>
                            <Field hidden name="customType" defaultValue={regAttr?.attribute.type}>
                                <Input value={regAttr?.attribute.type} />
                            </Field>
                            {CustomTypeEditor ? <CustomTypeEditor attribute={attribute} schema={schema} /> :
                                <FormStage validationClass={NameValidationDTO}>
                                    <HStack alignItems="flex-start">

                                        <FieldControl flex={1}>
                                            <FieldLabel >
                                                Attribute Name
                                            </FieldLabel>
                                            <Field name="name">
                                                <Input isDisabled={attribute?.name?.length! >= 0} />
                                            </Field>

                                            <FieldDescription>
                                                Enter a unique name
                                            </FieldDescription>
                                        </FieldControl>
                                    </HStack>
                                </FormStage>
                            }
                        </ModalBody>
                        <ModalFooter justifyContent="flex-start">
                            <HStack w="full" flex={1}>
                                <HStack flex={1}>
                                    <Button onClick={props?.onClose}>Cancel</Button>
                                </HStack>
                                <HStack>
                                    <FormBackButton>Back</FormBackButton>
                                    <FormSubmitButton>Save</FormSubmitButton>
                                </HStack>
                            </HStack>
                        </ModalFooter>
                    </ModalContent>
                </Form>
            </AttributeEditorContext.Provider>
        </Modal>
    )
}

export default AttributeEditorModal