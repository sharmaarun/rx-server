import React from "react"
import { Button as _Button, ButtonProps as _ButtonProps } from "@chakra-ui/react"
import { forwardRef } from "react"
export interface ButtonProps extends _ButtonProps {

}

export const Button = forwardRef((props: ButtonProps, ref: any) => {
    return (
        <_Button iconSpacing={1} ref={ref} colorScheme="brand"
        {...props} />
    )
})

import { ButtonGroup as _ButtonGroup, ButtonGroupProps as _ButtonGroupProps } from "@chakra-ui/react"
export interface ButtonGroupProps extends _ButtonGroupProps {

}

export const ButtonGroup = forwardRef((props: ButtonGroupProps, ref: any) => {
    return (
        <_ButtonGroup ref={ref} {...props} />
    )
})

export default {
    Button,
    ButtonGroup
}