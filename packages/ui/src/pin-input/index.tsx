import React from "react"
import { PinInput as _PinInput, PinInputProps as _PinInputProps, PinInputField } from "@chakra-ui/react"
import { HStack } from "../stack"
export interface PinInputProps extends Omit<_PinInputProps, "children"> {
    length?: number
}

export function PinInput({ length = 6, ...props }: PinInputProps) {
    return (
        <HStack w="100%" justifyContent="center">
            <_PinInput {...props} >
                {Array(length).fill(0).map((_, i) =>
                    <PinInputField key={i} />
                )}
            </_PinInput>
        </HStack>
    )
}

export default PinInput