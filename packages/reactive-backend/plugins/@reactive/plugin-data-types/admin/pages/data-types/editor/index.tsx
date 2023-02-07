import { Endpoint } from "@reactive/client"
import { toPascalCase } from "@reactive/commons"
import { Box, Button, Heading, HStack, Page, PageBody, PageHeader, PageToolbar, Stack, StackProps } from "@reactive/ui"
import { useOutletContext, useParams } from "react-router-dom"

export interface EditorPageProps extends StackProps {
    children?: any
}

const dummy = new Endpoint("dummy")
export function EditorPage({ children, ...props }: EditorPageProps) {
    const { name } = useParams() || {}
    const { endpoints = [] } = useOutletContext<any>() || {}
    const endpoint = endpoints?.filter?.((ep: any) => ep.name === name)
    return (
        <Page>
            <PageHeader>
                <Heading size="md">
                    {toPascalCase(name || "")}
                </Heading>
            </PageHeader>
            <PageToolbar>
                <HStack justifyContent="flex-end">
                    <Button onClick={(e: any) => { dummy.call("", {}, "post") }}>CREATE NEW</Button>
                </HStack>
            </PageToolbar>
            <PageBody>
                <Box minH="100vh">

                    <pre>
                        {JSON.stringify(endpoint || {}, null, 2)}
                    </pre>
                </Box>
            </PageBody>
        </Page>
    )
}

export default EditorPage