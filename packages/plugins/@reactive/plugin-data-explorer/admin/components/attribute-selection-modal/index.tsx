import { RegisteredAttribute, useAttributes } from "@reactive/client"
import { toPascalCase } from "@reactive/commons"
import { Button, Card, HStack, Icon, JumboAlert, List, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, ModalProps, ModalSubHeader, Stack } from "@reactive/ui"

export interface AttributeSelectionModalProps extends ModalProps {
    onChange?: (value: RegisteredAttribute) => void
}

export function AttributeSelectionModal({ children, onChange, ...props }: AttributeSelectionModalProps) {
    const { attributes } = useAttributes()
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
                    {attributes.length <= 0 ? <JumboAlert
                        status="warning"
                        title="No Attribute Types Registered"
                    />
                        : <>
                            <Stack>
                                <List>
                                    <HStack spacing={0} flexWrap="wrap" justifyContent="space-between">
                                        {attributes.map((attribute, index) => {
                                            const Icon_ = attribute.metadata.icon || <></>
                                            return <ListItem
                                                key={index}
                                                w="49%"
                                                py={2}
                                            >
                                                <Card onClick={e => { onChange?.(attribute as any) }} {...({
                                                    autoFocus: index === 0, leftIcon:
                                                        <Icon>
                                                            {<Icon_ />}
                                                        </Icon>
                                                })} flexDir="row" justifyContent="flex-start" as={Button} py={6} px={4} w="full">
                                                    {toPascalCase(attribute.attribute.customType || "")}
                                                </Card>
                                            </ListItem>
                                        })}
                                    </HStack>
                                </List>
                            </Stack>
                        </>
                    }
                </ModalBody>
                <ModalFooter >
                    <Button onClick={e => props?.onClose?.()}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default AttributeSelectionModal