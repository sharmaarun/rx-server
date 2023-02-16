import { BoxProps, Select as _Select, SelectProps as _SelectProps } from "@chakra-ui/react"
import { forwardRef } from "react"
export interface SelectProps extends _SelectProps {

}

export function Select(props: SelectProps) {
    return (
        <_Select {...props} />
    )
}

export interface SelectOptionProps extends React.HTMLAttributes<Partial<HTMLOptionElement>> {
    children?: any
    value?: any
}

export const SelectOption = forwardRef(({ children, ...props }: SelectOptionProps, ref: any) => {
    return (
        <option  {...(props as any)} ref={ref}>
            {children}
        </option>
    )
})

export default Select