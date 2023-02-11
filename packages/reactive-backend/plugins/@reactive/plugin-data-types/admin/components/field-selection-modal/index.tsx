import React from "react"
import { ActionButton, Button, Card, Heading, HStack, Icon, JumboAlert, List, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, ModalProps, ModalSubHeader, Stack, Text } from "@reactive/ui"
import { RegisteredField, useFields } from "@reactive/client"
import { toPascalCase } from "@reactive/commons"
import { RXICO_FILTER } from "@reactive/icons"

export interface FieldSelectionModalProps extends ModalProps {
    onChange?: (value: RegisteredField) => void
}

export function FieldSelectionModal({ children, onChange, ...props }: FieldSelectionModalProps) {
    const { fields } = useFields()
    return (
        <Modal size="3xl" {...props}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <ModalCloseButton />
                    Select Attribute Type
                    <ModalSubHeader>
                        Please select one of the attribute types from below to continue...
                    </ModalSubHeader>
                </ModalHeader>
                <ModalBody>
                    {fields.length <= 0 ? <JumboAlert
                        status="warning"
                        title="No Attribute Types Registered"
                    />
                        : <>
                            <Stack>
                                <List>
                                    <HStack spacing={0} flexWrap="wrap" justifyContent="space-between">
                                        {fields.map((field, index) =>
                                            <ListItem
                                                key={index}
                                                w="49%"
                                                py={2}
                                            >
                                                <Card onClick={e => { onChange?.(field) }} autoFocus={index === 0} flexDir="row" justifyContent="flex-start" leftIcon={
                                                    <Icon><RXICO_FILTER /></Icon>
                                                } as={Button} py={6} px={4} w="full">
                                                    {toPascalCase(field.field.customType || "")}
                                                </Card>
                                            </ListItem>)}
                                    </HStack>
                                </List>
                            </Stack>
                        </>
                    }
                </ModalBody>
                <ModalFooter >
                    <Button onClick={e=>props?.onClose?.()}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default FieldSelectionModal