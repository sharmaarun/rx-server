import React from "react"
import { Box, HStack, StackProps } from "@chakra-ui/react"
import { createContext, useContext, useState } from "react"


export interface SpreadSelectOptionProps extends StackProps {
    children?: any
    value: string
}

export type SpreadSelectContextType = {
    value?: string[]
    onSelect?: (value: string) => void
}

const SpreadSelectContext = createContext<SpreadSelectContextType>({

})

export function SpreadSelectOption({ children, value, ...props }: SpreadSelectOptionProps) {
    const { onSelect, value: values = [] } = useContext(SpreadSelectContext)

    const selected = values?.includes(value)
    return (
        <HStack
            onClick={() => { onSelect?.(value) }}
            pb={2}
            {...props}
        >
            <HStack
                justifyContent="center"
                alignItems="center"
                flex={1}
                bgColor={selected ? "purple.500" : "gray.100"}
                color={selected ? "whiteAlpha.900" : "blackAlpha.900"}
                p={4}
                borderRadius={4}
                cursor="pointer"
            >
                {children}
            </HStack>
        </HStack >
    )
}

export interface SpreadSelectProps extends Omit<StackProps, "onChange" | "defaultValue"> {
    children?: any
    multiSelect?: boolean
    defaultValue?: string | string[]
    onChange?: (value: string | string[]) => void
}

export function SpreadSelect({ children, multiSelect = false, defaultValue, onChange, ...props }: SpreadSelectProps) {
    const [value, setValue] = useState<string[]>(defaultValue ? (Array.isArray(defaultValue) ? defaultValue : [defaultValue]) : [])

    const onSelect = (val: string) => {
        let values_: string[] = [];
        if (multiSelect) {
            values_ = value?.filter((v: any) => v !== val) || []
            if (values_?.length >= value?.length) {
                values_?.push(val)
            }
        } else {
            values_ = [val]
        }
        setValue([...(values_ || [])])
        onChange?.(multiSelect ? values_ : values_[0])
    }
    return (
        <SpreadSelectContext.Provider value={{
            value,
            onSelect
        }}>
            <HStack flexWrap="wrap" justifyContent="center" spacing={0} {...props}>
                {children}
            </HStack>
        </SpreadSelectContext.Provider>
    )
}

export default SpreadSelect