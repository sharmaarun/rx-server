import { Checkbox as _Checkbox, CheckboxProps as _CheckboxProps } from "@chakra-ui/react"
export interface CheckboxProps extends _CheckboxProps {

}

export function Checkbox(props: CheckboxProps) {
    return (
        <_Checkbox {...props} />
    )
}

import { CheckboxGroup as _CheckboxGroup, CheckboxGroupProps as _CheckboxGroupProps } from "@chakra-ui/react"
export interface CheckboxGroupProps extends _CheckboxGroupProps {

}

export function CheckboxGroup(props: CheckboxGroupProps) {
    return (
        <_CheckboxGroup {...props} />
    )
}

export default { Checkbox, CheckboxGroup }