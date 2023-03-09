import React from "react"
import {
    NumberInput as _NumberInput,
    NumberInputProps as _NumberInputProps,
    NumberInputStepper,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInputField
} from "@chakra-ui/react"


export interface NumberInputProps extends _NumberInputProps {
    children?: any
}

export function NumberInput({ children, ...props }: NumberInputProps) {
    props.value = props.value ?? "0"
    return (
        <_NumberInput placeholder="0" {...props} >
            <NumberInputField placeholder="0" />
            <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
            </NumberInputStepper>
        </_NumberInput>
    )
}

export default NumberInput