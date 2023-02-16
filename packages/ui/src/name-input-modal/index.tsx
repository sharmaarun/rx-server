import { DefaultAttributesValidationClass } from "@reactive/client"
import { Field, FieldControl, FieldDescription } from "../form"
import { FormModal, FormModalProps } from "../form-modal"
import { } from "../heading"
import { Input } from "../input"
import { ModalBody, ModalHeader } from "../modal"
export interface NameInputModalProps extends FormModalProps { }

export class NameInputModalValidation extends DefaultAttributesValidationClass {

}

export function NameInputModal(props: NameInputModalProps) {
    return (
        <FormModal validationClass={NameInputModalValidation} {...props}>
            <ModalHeader>
                Enter name
            </ModalHeader>
            <ModalBody>
                <FieldControl>
                    <Field name="name" >
                        <Input placeholder="name" />
                    </Field>
                    <FieldDescription>
                        Enter a unique name
                    </FieldDescription>
                </FieldControl>
            </ModalBody>

        </FormModal>
    )
}