import React from "react"
import { Box, Heading, Page, PageBody, PageHeader, PageProps } from "@reactive/ui"

export interface RolesPageProps extends PageProps {
    children?: any
}

export function RolesPage({ children, ...props }: RolesPageProps) {
    return (
        <Page {...props}>
            <PageHeader>
                <Heading size="md">
                    Roles
                </Heading>
            </PageHeader>
            <PageBody>
                <Box>
                    Placeholder
                </Box>
            </PageBody>
        </Page>
    )
}

export default RolesPage