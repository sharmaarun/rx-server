import React from "react"
import { Stack, StackProps } from "@reactive/ui"

export interface MediaListPageProps extends StackProps {
    children?: any
}

export function MediaListPage({ children, ...props }: MediaListPageProps) {
    return (
        <Stack {...props}>
            
        </Stack>
    )
}

export default MediaListPage