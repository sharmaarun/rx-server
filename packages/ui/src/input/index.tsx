import { Input as _Input, InputProps as _InputProps } from "@chakra-ui/react";
import { forwardRef, useEffect, useState } from "react";
export interface InputProps extends _InputProps {

}
let itid: any = -1;
export const Input = forwardRef((props: InputProps, ref: any) => {
    const [val, setVal] = useState(props?.value || props?.defaultValue || "")
    useEffect(() => {
        if (val !== props?.value) {
            setVal(props?.value ? props.value + "" : "");
        }
    }, [props.value])
    const _onChange = (e: any) => {
        setVal(e.target.value);
        clearTimeout(itid)
        itid = setTimeout(() => props?.onChange?.(e), 60)
    }
    return (
        <_Input {...props} ref={ref} colorScheme="brand" value={val} onChange={_onChange} />
    )
})

import { InputGroup as _InputGroup, InputGroupProps as _InputGroupProps } from "@chakra-ui/react";
export interface InputGroupProps extends _InputGroupProps {

}

export function InputGroup(props: InputGroupProps) {
    return (
        <_InputGroup backgroundColor="input" {...props} />
    )
}

import { InputAddonProps as _InputAddonProps, InputLeftAddon as _InputLeftAddon } from "@chakra-ui/react";
export interface InputLeftAddonProps extends _InputAddonProps {

}

export function InputLeftAddon(props: InputLeftAddonProps) {
    return (
        <_InputLeftAddon {...props} />
    )
}

import { InputRightAddon as _InputRightAddon } from "@chakra-ui/react";
export interface InputRightAddonProps extends _InputAddonProps {

}

export function InputRightAddon(props: InputRightAddonProps) {
    return (
        <_InputRightAddon {...props} />
    )
}


import { InputElementProps as _InputElementProps, InputLeftElement as _InputLeftElement } from "@chakra-ui/react";
export interface InputLeftElementProps extends _InputElementProps {

}

export function InputLeftElement(props: InputLeftElementProps) {
    return (
        <_InputLeftElement {...props} />
    )
}

import { InputRightElement as _InputRightElement } from "@chakra-ui/react";

export interface InputRightElementProps extends _InputElementProps {

}

export function InputRightElement(props: InputRightElementProps) {
    return (
        <_InputRightElement {...props} />
    )
}

import { Textarea as _Textarea, TextareaProps as _TextareaProps } from "@chakra-ui/react";
export interface TextareaProps extends _TextareaProps {

}

export function Textarea(props: TextareaProps) {
    return (
        <_Textarea {...props} />
    )
}

export default {
    Input,
    InputGroup,
    InputLeftAddon,
    InputRightAddon,
    InputLeftElement,
    InputRightElement,
    Textarea
}