import React, { useRef, useState } from "react"
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, ModalProps } from "../modal"
import Heading, { } from "../heading"
import { Field, Form, FormProps } from "../form"
import { Input } from "../input"
import { FormModal, FormModalProps, useFormModal } from "../form-modal"
import { useDisclosure } from "../utils"
import { Button } from "../button"
import { HStack } from "../stack"
export interface NameInputModalProps extends FormModalProps { }

export function NameInputModal(props: NameInputModalProps) {
    return (
        <FormModal {...props}>
            <ModalHeader>
                Enter name
            </ModalHeader>
            <ModalBody>
                <Field name="name" >
                    <Input placeholder="name" />
                </Field>
            </ModalBody>

        </FormModal>
    )
}