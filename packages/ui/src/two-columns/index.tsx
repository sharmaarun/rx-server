import React from "react"
import Box from "../box"
import { HStack, Stack, StackProps } from "../stack"

export interface TwoColumnsPageProps extends StackProps {
    children?: any
}

export function TwoColumns({ children, ...props }: TwoColumnsPageProps) {
    return (
        <HStack spacing={0} h="100%" alignItems="stretch" {...props}>
            {React.Children.map(children, (c, cind) =>
                <Stack spacing={0} justifyContent="stretch" key={cind}
                    {...(cind === 0 ? {
                        minW: "250px",
                        borderRight: "1px solid",
                        borderColor: "blackAlpha.100"
                    } : {
                        flex: 1
                    })}
                >
                    {c}
                </Stack>)}
        </HStack>
    )
}

export default TwoColumns