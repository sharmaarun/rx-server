import { Input as _Input, InputProps as _InputProps } from "@chakra-ui/react";
import { forwardRef, useEffect, useState } from "react";
export interface InputProps extends _InputProps {

}
export const Input = forwardRef((props: InputProps, ref: any) => {

    return (
        <_Input {...props} ref={ref} />
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

export const Textarea = forwardRef((props: TextareaProps, ref: any) => {
    return (
        <_Textarea {...props} ref={ref} />
    )
})

export default {
    Input,
    InputGroup,
    InputLeftAddon,
    InputRightAddon,
    InputLeftElement,
    InputRightElement,
    Textarea
}