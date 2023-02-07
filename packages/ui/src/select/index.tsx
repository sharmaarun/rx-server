import React from "react"
import { BoxProps, Select as _Select, SelectProps as _SelectProps } from "@chakra-ui/react"
import { createContext, forwardRef, useContext } from "react"
import { Button, ButtonGroup, ButtonProps } from "../button"
export interface SelectProps extends _SelectProps {

}

export function Select(props: SelectProps) {
    return (
        <_Select {...props} />
    )
}

export interface SelectOptionProps extends BoxProps {
    children?: any
}

export const SelectOption = forwardRef(({ children, ...props }: SelectOptionProps, ref: any) => {
    return (
        <option  {...(props as any)} ref={ref}>
            {children}
        </option>
    )
})

export interface SpreadSelectProps {
    value?: string
    onChange?: (value: string) => void
    children?: any;
}

const SpreadSelectContext = createContext({} as any)

export function SpreadSelect({ children, value, onChange }: SpreadSelectProps) {

    return (
        <ButtonGroup isAttached>
            <SpreadSelectContext.Provider value={{ value, onChange }}>
                {children}
            </SpreadSelectContext.Provider>
        </ButtonGroup>
    )
}
export interface SpreadSelectOptionProps extends ButtonProps {
    value?: string;
}

export const SpreadSelectOption = forwardRef(({ children, value, ...props }: SpreadSelectOptionProps, ref: any) => {
    const { value: val, onChange } = useContext(SpreadSelectContext)
    const onClick = (e: any) => {
        if (value === val) {
            onChange?.(undefined)
        } else {
            onChange?.(value)
        }
    }
    return < Button
        variant="outline"
        iconSpacing={0}
        p={0}
        {...props}
        isActive={val === value}
        onClick={onClick}
        ref={ref}
    >
        {children}
    </Button >
})

export default Select