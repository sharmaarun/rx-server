import { Stack, StackProps } from "@reactive/ui"

export interface RootLayoutProps extends StackProps {
    children?: any
}

export function RootLayout({ children, ...props }: RootLayoutProps) {
    return (
        <Stack bg="gray.50" spacing={0} {...props}>
            {children}
        </Stack>
    )
}

export default RootLayout