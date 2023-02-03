import { NumberInput as _NumberInput, NumberInputProps as _NumberInputProps } from "@chakra-ui/react"
export interface NumberInputProps extends _NumberInputProps {

}

export function NumberInput(props: NumberInputProps) {
    return (
        <_NumberInput {...props} />
    )
}

import { NumberInputField as _NumberInputField, NumberInputFieldProps as _NumberInputFieldProps } from "@chakra-ui/react"
export interface NumberInputFieldProps extends _NumberInputFieldProps {

}

export const NumberInputField = forwardRef((props: NumberInputFieldProps, ref: any) => {
    return (
        <_NumberInputField {...props} ref={ref} />
    )
})

import { NumberInputStepper as _NumberInputStepper, NumberInputStepperProps as _NumberInputStepperProps } from "@chakra-ui/react"
export interface NumberInputStepperProps extends _NumberInputStepperProps {

}

export function NumberInputStepper(props: NumberInputStepperProps) {
    return (
        <_NumberInputStepper {...props} />
    )
}

import { NumberIncrementStepper as _NumberIncrementStepper, NumberIncrementStepperProps as _NumberIncrementStepperProps } from "@chakra-ui/react"
export interface NumberIncrementStepperProps extends _NumberIncrementStepperProps {

}

export function NumberIncrementStepper(props: NumberIncrementStepperProps) {
    return (
        <_NumberIncrementStepper {...props} />
    )
}

import { NumberDecrementStepper as _NumberDecrementStepper, NumberDecrementStepperProps as _NumberDecrementStepperProps } from "@chakra-ui/react"
import { forwardRef, useCallback, useEffect, useState } from "react"
import { InputGroup, InputLeftElement, InputRightElement } from "../input"
export interface NumberDecrementStepperProps extends _NumberDecrementStepperProps {

}

export function NumberDecrementStepper(props: NumberDecrementStepperProps) {
    return (
        <_NumberDecrementStepper {...props} />
    )
}

export interface NumericInputProps extends Omit<NumberInputProps, "onChange"> {
    leftElement?: any
    rightElement?: any
    floatingPoint?: boolean
    onChange?: (value: number) => void
}
let itid: any = -1
export const NumericInput = forwardRef(({ defaultValue, floatingPoint=false, leftElement, rightElement, value, ...props }: NumericInputProps, ref: any) => {
    const [val, setVal] = useState(value || defaultValue || "0.00")
    useEffect(() => {
        if (val !== value) {
            setVal(value ? value + "" : "");
        }
    }, [value])
    const _onChange = (sVal: string, eVal: number) => {
        clearTimeout(itid);
        setVal(sVal)
        itid = setTimeout(() => {
            if (sVal !== val) {
                const v = floatingPoint ? eVal : parseInt(eVal.toFixed(0))
                props?.onChange?.(v)
            }
        }, 60)
    }
    return (
        <NumberInput {...props} precision={2} step={1.0} onChange={_onChange} value={val}>
            <InputGroup>
                {leftElement ? <InputLeftElement borderRight="1px solid " borderColor="borderlight">{leftElement}</InputLeftElement> : ""}
                <NumberInputField pl={leftElement ? 12 : 2} pr={rightElement ? 12 : 2} ref={ref} />
                {rightElement ? <InputRightElement>{rightElement}</InputRightElement> : ""}
            </InputGroup>
            <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
            </NumberInputStepper>
        </NumberInput>
    )
})


export default {
    NumberInput,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInputStepper,
    NumberInputField,
    NumericInput
}