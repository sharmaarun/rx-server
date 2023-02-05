import React from "react"
import { Radio as _Radio, RadioProps as _RadioProps } from "@chakra-ui/react"
export interface RadioProps extends _RadioProps {

}

export function Radio(props: RadioProps) {
    return (
        <_Radio {...props} />
    )
}

import { RadioGroup as _RadioGroup, RadioGroupProps as _RadioGroupProps } from "@chakra-ui/react"
export interface RadioGroupProps extends _RadioGroupProps {

}

export function RadioGroup(props: RadioGroupProps) {
    return (
        <_RadioGroup {...props} />
    )
}

export default { RadioGroup, Radio }