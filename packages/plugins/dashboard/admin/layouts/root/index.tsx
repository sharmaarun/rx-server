import React from "react"
import { Stack, StackProps } from "@chakra-ui/react"

export interface RootLayoutProps extends StackProps {
    children?: any
}

export function RootLayout({ children, ...props }: RootLayoutProps) {
    return (
        <Stack spacing={0} {...props}>
            {children}
        </Stack>
    )
}

export default RootLayout