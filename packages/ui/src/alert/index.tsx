import React from "react"
import { Alert as _Alert, AlertProps as _AlertProps } from "@chakra-ui/react"
export interface AlertProps extends _AlertProps {

}

export function Alert(props: AlertProps) {
    return (
        <_Alert borderRadius={8} {...props} />
    )
}


import { AlertIcon as _AlertIcon, AlertIconProps as _AlertIconProps } from "@chakra-ui/react"
export interface AlertIconProps extends _AlertIconProps {

}

export function AlertIcon(props: AlertIconProps) {
    return (
        <_AlertIcon {...props} />
    )
}

import { AlertTitle as _AlertTitle, AlertTitleProps as _AlertTitleProps } from "@chakra-ui/react"
export interface AlertTitleProps extends _AlertTitleProps {

}

export function AlertTitle(props: AlertTitleProps) {
    return (
        <_AlertTitle {...props} />
    )
}



import { AlertDescription as _AlertDescription, AlertDescriptionProps as _AlertDescriptionProps } from "@chakra-ui/react"
export interface AlertDescriptionProps extends _AlertDescriptionProps {

}

export function AlertDescription(props: AlertDescriptionProps) {
    return (
        <_AlertDescription {...props} />
    )
}


export interface JumboAlertProps extends AlertProps {
    children?: any
    title?: any
    description?: any
}

export function JumboAlert({ children, title, status, description, ...props }: JumboAlertProps) {
    return (
        <Alert
            border="1px solid"
            status={status}
            bgColor={
                status === "error" ? "red.50"
                    : status === "info" ? "gray.100"
                        : status === "success" ? "teal.50"
                            : status === "warning" ? "yellow.50" :
                                "gray.100"
            }
            borderColor={
                status === "error" ? "red.200"
                    : status === "info" ? "gray.300"
                        : status === "success" ? "teal.300"
                            : status === "warning" ? "yellow.300" :
                                "gray.300"
            }
            variant='subtle'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            textAlign='center'
            height='200px'
            {...props}
        >
            <AlertIcon boxSize='40px' mr={0} />
            <AlertTitle mt={4} mb={1} fontSize='lg'>
                {title}
            </AlertTitle>
            <AlertDescription maxWidth='sm'>
                {description}
            </AlertDescription>
        </Alert>
    )
}