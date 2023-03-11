import React, { useEffect, useState } from "react"
import { ActionListItem, Box, EntityListViewer, EntityListViewerAddNewButton, EntityListViewerBody, Heading, HStack, Page, PageBody, PageHeader, PageProps, PageToolbar, Spinner } from "@reactive/ui"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import { Obj, parseQueryString } from "@reactive/client"
import { Query } from "@reactive/commons"

export interface RolesPageProps extends PageProps {
    children?: any
}

let tids: any = {
    search: 0
}
export function RolesPage({ children, ...props }: RolesPageProps) {

    const obj = new Obj("role")

    const [result, setResult] = useState<any>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        clearTimeout(tids.search)
        tids.search = setTimeout(async () => {
            try {
                setLoading(true)
                const res = await obj?.listWithCount({})
                setResult(res)
            } catch (e) {
                setLoading(false)
            } finally {
                setLoading(false)
            }

        }, 200)
    }, [])

    return (
        <EntityListViewer
            entityName="role"
            data={result?.rows}
            count={result.count}
        >
            <Page {...props}>
                <PageHeader>
                    <Heading size="md">
                        Roles
                    </Heading>
                </PageHeader>
                <PageToolbar>
                    <Link to="new">
                        <EntityListViewerAddNewButton />
                    </Link>
                </PageToolbar>
                <PageBody>
                    <>
                        {loading &&
                            <HStack justifyContent="center">
                                <Spinner />
                            </HStack>
                        }
                        {!loading && <EntityListViewerBody
                            listItemRenderer={(item, ind) =>
                                <ActionListItem
                                    bg="white"
                                    key={ind}
                                    as={Link}
                                    {...({ to: "" + item.id })}
                                >
                                    {item.name}
                                </ActionListItem>
                            }
                        />}
                    </>
                </PageBody>
            </Page>
        </EntityListViewer>
    )
}

export default RolesPage