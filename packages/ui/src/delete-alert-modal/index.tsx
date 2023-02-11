import { ModalProps } from "@chakra-ui/react"
import { Equals } from "class-validator"
import { Field, FieldControl, FieldLabel } from "../form"
import FormModal, { FormModalProps } from "../form-modal"
import { Input } from "../input"
import { ModalBody, ModalHeader } from "../modal"
import { Tag } from "../tag"

export interface DeleteAlertModalProps extends Omit<ModalProps, "children">, Omit<FormModalProps, "children"> {
    children?: any
}

export class DeleteAlertModalDTO {
    @Equals("delete", { message: "Invalid value" })
    val!: string
}

export function DeleteAlertModal({ children, ...props }: DeleteAlertModalProps) {
    return (
        <FormModal {...props} validationClass={DeleteAlertModalDTO}>
            <ModalHeader>
                Alert: Delete Confirmation
            </ModalHeader>
            <ModalBody>
                <FieldControl>
                    <FieldLabel>Type <Tag variant="outline" colorScheme="red">delete</Tag> below and press OK button to confirm</FieldLabel>
                    <Field name="val" >
                        <Input placeholder="delete" />
                    </Field>
                </FieldControl>
            </ModalBody>

        </FormModal>
    )
}

export default DeleteAlertModal