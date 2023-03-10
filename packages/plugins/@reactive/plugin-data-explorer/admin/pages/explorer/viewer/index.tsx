import { Obj, parseQueryString, stringifyQuery } from "@reactive/client"
import { Query, toPascalCase } from "@reactive/commons"
import { ActionListItem, Box, EntityListViewer, EntityListViewerAddNewButton, EntityListViewerBody, EntityListViewerDateRangeSelector, EntityListViewerDateRangeSelectorToggleButton, EntityListViewerFiltersEditor, EntityListViewerFiltersEditorToggleButton, EntityListViewerPageSizeSelector, EntityListViewerPagination, EntityListViewerSortMenu, Heading, HStack, Page, PageBody, PageFooter, PageHeader, PageToolbar, Spinner, StackProps, Text, useEntityListView } from "@reactive/ui"
import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"

export interface ListViewPageProps extends StackProps {
    children?: any
}

const tids: any = {
    search: 0
}
export function ListViewPage({ children, ...props }: ListViewPageProps) {
    const { name } = useParams() || {}
    const navigate = useNavigate()
    const { search } = useLocation()

    const obj = new Obj(name)

    const [result, setResult] = useState<any>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        clearTimeout(tids.search)
        tids.search = setTimeout(async () => {
            try {
                setLoading(true)
                const {
                    where = {},
                    pagination = { page: 1, pageSize: 10 },
                    order
                }: Query = parseQueryString(search)
                const res = await obj?.listWithCount({
                    where,
                    pagination,
                    order
                })
                setResult(res)
            } catch (e) {
                setLoading(false)
            } finally {
                setLoading(false)
            }

        }, 200)
    }, [name, search])

    const onSearch = (queryObj: Query) => {
        const query = stringifyQuery(queryObj)
        if (typeof window !== "undefined") {
            navigate(window.location.pathname + `?${query}`)
        }
    }

    return (
        <EntityListViewer
            onSearch={onSearch}
            query={parseQueryString(search)}
            data={result?.rows}
            count={result?.count}
            entityName={name}
        >
            <Page>
                <PageHeader>
                    <HStack>
                        <Heading size="md">
                            Data Type : {toPascalCase(name || "")}
                        </Heading>
                    </HStack>
                </PageHeader>
                <PageToolbar>
                    <EntityListViewerDateRangeSelectorToggleButton />
                    <EntityListViewerFiltersEditorToggleButton />
                    <EntityListViewerSortMenu />
                    <Link to={`/admin/explorer/${name}/new`}>
                        <EntityListViewerAddNewButton />
                    </Link>
                </PageToolbar>
                <PageBody flex={1}>
                    {loading ?
                        <HStack justifyContent="center">
                            <Spinner />
                        </HStack>
                        :
                        <EntityListViewerBody
                            listItemRenderer={(item, ind) =>
                                <ActionListItem
                                    role="group"
                                    key={ind}
                                    p={0}
                                    pr={4}
                                >
                                    <HStack>
                                        <HStack flex={1} >
                                            <Box flex={1}>
                                                <Link to={`/admin/explorer/${name}/${item?.id}`}>
                                                    <Text py={4}>
                                                        {item.name || item.id}
                                                    </Text>
                                                </Link>
                                            </Box>
                                        </HStack>
                                    </HStack>
                                </ActionListItem>
                            }
                        >
                            <EntityListViewerFiltersEditor />
                            <EntityListViewerDateRangeSelector />
                        </EntityListViewerBody>
                    }
                </PageBody>
                <PageFooter>
                    <EntityListViewerPageSizeSelector flex={1} />
                    <EntityListViewerPagination />
                </PageFooter>
            </Page >
        </EntityListViewer>
    )
}

export default ListViewPage