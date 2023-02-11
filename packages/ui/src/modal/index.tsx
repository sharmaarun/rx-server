import { Modal as _Modal, ModalProps as _ModalProps } from "@chakra-ui/react"
export interface ModalProps extends _ModalProps {

}

export function Modal(props: ModalProps) {
    return (
        <_Modal {...props} />
    )
}

import { ModalHeader as _ModalHeader, ModalHeaderProps as _ModalHeaderProps } from "@chakra-ui/react"
export interface ModalHeaderProps extends _ModalHeaderProps {

}

export function ModalHeader(props: ModalHeaderProps) {
    return (
        <_ModalHeader {...props} />
    )
}

import { ModalOverlay as _ModalOverlay, ModalOverlayProps as _ModalOverlayProps } from "@chakra-ui/react"
export interface ModalOverlayProps extends _ModalOverlayProps {

}

export function ModalOverlay(props: ModalOverlayProps) {
    return (
        <_ModalOverlay {...props} />
    )
}

import { ModalContent as _ModalContent, ModalContentProps as _ModalContentProps } from "@chakra-ui/react"
export interface ModalContentProps extends _ModalContentProps {

}

export function ModalContent(props: ModalContentProps) {
    return (
        <_ModalContent {...props} />
    )
}

import { ModalFooter as _ModalFooter, ModalFooterProps as _ModalFooterProps } from "@chakra-ui/react"
export interface ModalFooterProps extends _ModalFooterProps {

}

export function ModalFooter(props: ModalFooterProps) {
    return (
        <_ModalFooter bgColor="gray.50" {...props} />
    )
}

import { ModalBody as _ModalBody, ModalBodyProps as _ModalBodyProps } from "@chakra-ui/react"
export interface ModalBodyProps extends _ModalBodyProps {

}

export function ModalBody(props: ModalBodyProps) {
    return (
        <_ModalBody pb={4} {...props} />
    )
}

import { CloseButtonProps, ModalCloseButton as _ModalCloseButton } from "@chakra-ui/react"
import Text, { TextProps } from "../text"
export interface ModalCloseButtonProps extends CloseButtonProps {

}

export function ModalCloseButton(props: ModalCloseButtonProps) {
    return (
        <_ModalCloseButton {...props} />
    )
}

export interface ModalSubHeaderProps extends TextProps {

}

export function ModalSubHeader(props: ModalSubHeaderProps) {
    return (
        <Text fontSize="xs">{props.children}</Text>
    )
}




export default {
    Modal,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    ModalContent,
    ModalOverlay
}