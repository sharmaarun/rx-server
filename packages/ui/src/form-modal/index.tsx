import { useState } from "react"
import { ActionButton, Button } from "../button"
import { Form, FormProps } from "../form"
import { } from "../heading"
import { Modal, ModalContent, ModalFooter, ModalOverlay, ModalProps } from "../modal"
import { HStack } from "../stack"
import { useDisclosure } from "../utils"
export interface FormModalProps extends ModalProps, Omit<FormProps, "scrollBehavior" | "children"> {
    onSubmit?: (value: any) => void
}

export function FormModal({ children, ...props }: FormModalProps) {
    return (
        <Modal {...props}>
            <ModalOverlay />
            <ModalContent>
                <Form {...(props as any)}>
                    {children}
                    <ModalFooter>
                        <HStack>
                            <Button onClick={props?.onClose}>Cancel</Button>
                            <ActionButton type="submit" colorScheme="purple">OK</ActionButton>
                        </HStack>
                    </ModalFooter>
                </Form>
            </ModalContent>
        </Modal>
    )
}

export type UseFormModalProps = {
    defaultValue?: any
    onSubmit?: (value?: any) => void
}

export const useFormModal = (props?: UseFormModalProps) => {
    const { defaultValue = {}, onSubmit: onSubmit_ } = props || {}
    const [value, setValue] = useState<any>(defaultValue);
    const { isOpen, onClose, onOpen } = useDisclosure({

    })

    const onSubmit = (val: any) => {
        setValue(val)
        onSubmit_?.(val)
        onClose?.()
    }

    return {
        defaultValue,
        onSubmit,
        onOpen,
        onClose,
        isOpen,
        value
    }
}

export default FormModal