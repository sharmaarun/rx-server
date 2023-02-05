import React from "react"
import { HStack as _HStack, Stack as _Stack, StackProps as _StackProps } from "@chakra-ui/react"
import { forwardRef } from "react"

export interface StackProps extends _StackProps {

}

export const Stack = forwardRef((props: StackProps, ref: any)=> {
    return (
        <_Stack ref={ref} {...props} />
    )
})

export interface HStackProps extends _StackProps {

}

export const HStack = forwardRef((props: HStackProps,ref:any)=> {
    return (
        <_HStack ref={ref} {...props} />
    )
})


export default Stack