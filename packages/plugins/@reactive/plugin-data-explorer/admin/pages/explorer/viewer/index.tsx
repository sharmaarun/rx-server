import { Obj } from "@reactive/client"
import { toPascalCase } from "@reactive/commons"
import { ActionButton, ActionListItem, Heading, HStack, JumboAlert, List, Page, PageBody, PageHeader, PageToolbar, Stack, StackProps } from "@reactive/ui"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

export interface ListViewPageProps extends StackProps {
    children?: any
}


export function ListViewPage({ children, ...props }: ListViewPageProps) {
    const { name } = useParams() || {}
    const user = new Obj(name)
    const [list, setList] = useState([])
    useEffect(() => {
        setTimeout(async () => {
            setList(await user.list())
        }, 0)
    }, [name])
    return (
        <Page>
            <PageHeader>
                <HStack>
                    <Heading size="md">
                        Data Type : {toPascalCase(name || "")}
                    </Heading>
                </HStack>
            </PageHeader>
            <PageToolbar>
                <HStack justifyContent="flex-end">
                    <Link to={`/admin/explorer/${name}/new`}>
                        <ActionButton colorScheme="purple" >Add New {toPascalCase(name || "")}</ActionButton>
                    </Link>
                </HStack>
            </PageToolbar>
            <PageBody>
                {list?.length ?
                    <>

                        <Stack w="100%" spacing={4}>
                            <Heading pl={2} size="xs">
                                Total : {list.length} Entries
                            </Heading>
                            <List spacing={2}>
                                {list?.map((li, ind) =>
                                    <ActionListItem key={ind}>
                                        <Link to={`/admin/explorer/${name}/${li?.id}`}>
                                            {li.name || li.id}
                                        </Link>
                                    </ActionListItem>)}
                            </List>
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

export default ListViewPage