import "reflect-metadata"
//
import { RegisteredField } from "@reactive/client"
import { Field as FieldType, toPascalCase } from "@reactive/commons"
import { Button, Checkbox, Field, FieldControl, FieldDescription, FieldLabel, Form, FormBackButton, FormModalProps, FormStage, FormSubmitButton, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useFormContext } from "@reactive/ui"

export interface FieldEditorModalProps extends Omit<FormModalProps, "children"> {
    field?: RegisteredField
    onSubmit?: (field: FieldType) => void
}

export function FieldEditorModal({ field, onSubmit,middlewares, errors, ...props }: FieldEditorModalProps) {
    const CustomTypeEditor = field?.metadata.components?.typeEditor
    return (
        <Modal size="3xl" {...props}>
            <ModalOverlay />
            <Form onSubmit={v => {
                onSubmit?.(v as any)
                props?.onClose?.()
            }
            }
                errors={errors}
                middlewares={middlewares}
                defaultValue={field?.field as any}
                >
                <ModalContent>
                    <ModalHeader>
                        <ModalCloseButton />
                        {toPascalCase(field?.field?.customType || "")}
                    </ModalHeader>
                    <ModalBody>
                        {CustomTypeEditor && <CustomTypeEditor />}
                        <FormStage>
                            <FieldControl>
                                <FieldLabel>
                                    Required
                                </FieldLabel>
                                <Field name="required">
                                    <HStack>
                                        <Checkbox />
                                        <FieldDescription>
                                            Make it required in the databasr
                                        </FieldDescription>
                                    </HStack>
                                </Field>

                            </FieldControl>
                        </FormStage>
                    </ModalBody>
                    <ModalFooter justifyContent="flex-start">
                        <HStack w="full" flex={1}>
                            <HStack flex={1}>
                                <Button onClick={props?.onClose}>Cancel</Button>
                            </HStack>
                            <HStack>
                                <FormBackButton>Back</FormBackButton>
                                <FormSubmitButton>Submit</FormSubmitButton>
                            </HStack>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Form>
        </Modal>
    )
}

export default FieldEditorModal