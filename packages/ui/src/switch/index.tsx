import React from "react"
import { Switch as _Switch, SwitchProps as _SwitchProps, FormLabel } from "@chakra-ui/react"
import Box from "../box";
import { HStack } from "../stack";
export interface SwitchProps extends _SwitchProps {
    label?: any
    value?: any
}

export function Switch(props: SwitchProps) {
    const { label } = props;
    return (
        label ? <HStack>
            <Box flex={1} pl={1}>
                <FormLabel fontWeight={"normal"}>{label}</FormLabel>
            </Box>
            <_Switch colorScheme="brand" {...props} />
        </HStack> : <_Switch {...props} />
    )
}

export default Switch