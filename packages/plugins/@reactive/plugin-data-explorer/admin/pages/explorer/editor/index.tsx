import { useAttributes } from "@reactive/client"
import { toPascalCase } from "@reactive/commons"
import { ActionButton, Heading, HStack, JumboAlert, Page, PageBody, PageHeader, PageToolbar, Stack, StackProps } from "@reactive/ui"
import { useOutletContext, useParams } from "react-router-dom"
import { SchemaEditorOutletContext } from ".."
export interface EditorPageProps extends StackProps {
    children?: any
}


export function EditorPage({ children, ...props }: EditorPageProps) {
    const { name } = useParams() || {}
    const { attributes } = useAttributes()
    const { schemas = [], newSchema } = useOutletContext<SchemaEditorOutletContext>() || {}


    const schema = schemas?.find(s => s.name === name)
    return (
        <Page>
            <PageHeader>
                <HStack>
                    <Heading size="md">
                        Data Type : {toPascalCase(schema?.name || "")}
                    </Heading>
                </HStack>
            </PageHeader>
            <PageToolbar>
                <HStack justifyContent="flex-end">

                    <ActionButton colorScheme="purple" >Add New {toPascalCase(schema?.name)}</ActionButton>
                </HStack>
            </PageToolbar>
            <PageBody>
                {schema ?
                    <>

                        <Stack w="100%" spacing={4}>
                            <Heading pl={2} size="xs">
                                Total : 255 Entries
                            </Heading>

                        </Stack>
                    </> : <JumboAlert
                        title="No entries found"
                        description="Click here to create one now..."
                    />
                }
            </PageBody>
        </Page >
    )
}

export default EditorPage