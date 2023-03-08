import { Obj, useEntityObj, useServerContext } from "@reactive/client"
import { Operator, Query, QueryOrderItem, toPascalCase } from "@reactive/commons"
import { RXICO_CALENDAR, RXICO_FILTER, RXICO_SORT, RXICO_TRASH } from "@reactive/icons"
import { ActionButton, ActionListItem, Box, Checkbox, Pagination, Heading, HStack, Icon, IconButton, JumboAlert, List, Page, PageBody, PageFooter, PageHeader, PageToolbar, Stack, StackProps, Text, Tooltip, useDisclosure, Select, SelectOption, Spinner } from "@reactive/ui"
import { SortMenu } from "../../../components/sort"
import { parse, stringify } from "qs"
import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import { EntityFilters, FilterDTO } from "../../../components/filters"
import DateRangeInput from "../../../components/date-range"

export interface ListViewPageProps extends StackProps {
    children?: any
}

const tids: any = {}
export function ListViewPage({ children, ...props }: ListViewPageProps) {
    const { name } = useParams() || {}
    const navigate = useNavigate()
    const { endpoints } = useServerContext()
    const filtersDisclosure = useDisclosure()
    const dateRangeDisclosure = useDisclosure()
    const { search: locationSearchStr, pathname } = useLocation()
    const [loading, setLoading] = useState(true)
    const obj = new Obj(name)
    const schema = endpoints?.find(ep => ep?.schema?.name === name)?.schema as any

    const [list, setList] = useState([])
    const [pageSize, setPageSize] = useState(10)
    const [count, setCount] = useState(0)

    useEffect(() => {
        filtersDisclosure.onClose()
        dateRangeDisclosure.onClose()
    }, [name])


    useEffect(() => {
        clearTimeout(tids.search)
        tids.search = setTimeout(async () => {
            try {
                setLoading(true)
                const {
                    where = {},
                    pagination = { page: 1, pageSize },
                    order
                }: Query = parseQueryString(locationSearchStr)
                const { rows, count } = await obj?.listWithCount({
                    where,
                    pagination,
                    order
                })
                setList(rows)
                setCount(count)
            } catch (e) {
                setLoading(false)
            } finally {
                setLoading(false)
            }

        }, 50)
    }, [name, locationSearchStr])

    useEffect(() => {
        const { pagination }: Query = parseQueryString(locationSearchStr)
        console.log(pagination, pageSize)
        onPageChange(pagination?.page ?? 1)
    }, [pageSize])

    const search = (query: string) => {
        if (typeof window !== "undefined") {
            navigate(window.location.pathname + "?" + query)
        }
    }

    const filtersToFiltersQuery = (filters: FilterDTO[]) => {
        const query = {}
        for (let filter of filters || []) {
            query[filter.attributeName] = {
                [filter.key]: filter.value
            }
        }
        return query
    }
    const filtersQueryToFilters = (query: any) => {
        const filters: FilterDTO[] = []
        for (let name in (query || {})) {
            if (["createdAt"].includes(name)) continue;
            for (let key in (query[name] || {})) {
                let filter = new FilterDTO()
                filter.attributeName = name
                filter.key = key
                filter.value = query[name][key]
                filters.push(filter)
            }
        }
        return filters
    }

    const onFiltersChange = (filters: FilterDTO[]) => {
        const queryObj = {
            ...(parseQueryString(locationSearchStr) || {}),
            where: filtersToFiltersQuery(filters)
        }
        const queryStr = stringify(queryObj)
        search(queryStr)
    }

    const onDateRangeChange = (dateRange: Date[]) => {

        const createdAt = {}
        if (dateRange[0]) {
            createdAt[Operator.gte] = dateRange[0]
        }
        if (dateRange[1]) {
            createdAt[Operator.lte] = dateRange[1]
        }
        let { where, ...queryObj }: Query = (parseQueryString(locationSearchStr) || {})
        queryObj = {
            ...queryObj,
            where: {
                ...(where || {}),
                // ...(Object.keys(createdAt).length > 0 ? { createdAt } : {})
                createdAt
            }
        } as Query
        const queryStr = stringify(queryObj)
        search(queryStr)
        if (dateRange.length <= 0) {
            dateRangeDisclosure.onClose()
        }
    }

    const onPageChange = (page: number) => {
        if (page <= 0 || page > ((count / pageSize) + 1)) return
        const { pagination, ...rest }: Query = parseQueryString(locationSearchStr) || {}
        const queryObj = {
            ...(rest || {}),
            pagination: {
                ...pagination,
                page: parseInt(page + ""),
                pageSize: parseInt(pageSize + "")
            }
        }
        const queryStr = stringify(queryObj)
        search(queryStr)
    }

    const onSortChange = (value: QueryOrderItem) => {
        const { order, ...rest }: Query = parseQueryString(locationSearchStr) || {}
        const queryObj: Query = {
            ...(rest || {}),
            order: [value]
        }

        const queryStr = stringify(queryObj)
        console.log(queryStr)
        search(queryStr)
    }


    const parseQueryString = (str: string) => {
        const queryStr = str
        const queryObj = parse(queryStr?.startsWith("?") ? queryStr?.substring(1) : (queryStr || "")) || {}
        return queryObj
    }

    const { where = {}, pagination = {
        page: 1,
        pageSize
    }, order = [] }: Query = parseQueryString(locationSearchStr)
    pagination.page = parseInt(pagination.page + "")
    pagination.pageSize = parseInt(pagination.pageSize + "")
    const dt1 = (where as any)?.createdAt?.gte
    const dt2 = (where as any)?.createdAt?.lte
    let dateRange = []
    if (dt1) {
        dateRange.push(new Date(dt1))
    }
    if (dt2) {
        dateRange.push(new Date(dt2))
    }
    const filters = filtersQueryToFilters(where)
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
                    <Tooltip label="Date Range">
                        <IconButton
                            onClick={dateRangeDisclosure.onToggle}
                            aria-label="Date Range"
                            isActive={dateRange?.length > 0 || dateRangeDisclosure.isOpen}
                        >
                            <Icon>
                                <RXICO_CALENDAR />
                            </Icon>
                        </IconButton>
                    </Tooltip>
                    <Tooltip label="Filters">
                        <IconButton
                            isActive={filters?.length > 0 || filtersDisclosure.isOpen}
                            onClick={e => filtersDisclosure.onToggle()}
                            aria-label="Filters"
                        >
                            <Icon>
                                <RXICO_FILTER />
                            </Icon>
                        </IconButton>
                    </Tooltip>

                    <SortMenu value={order?.[0]} onChange={onSortChange} schema={schema} />

                    <Link to={`/admin/explorer/${name}/new`}>
                        <Tooltip label={`Add New ${toPascalCase(name || "")}`}>
                            <ActionButton colorScheme="purple" >Add New {toPascalCase(name || "")}</ActionButton>
                        </Tooltip>
                    </Link>
                </HStack>
            </PageToolbar>
            <PageBody spacing={2} >
                <>
                    <Stack>
                        {schema && filtersDisclosure.isOpen &&
                            <EntityFilters defaultValue={filters} schema={schema} onChange={onFiltersChange} />}
                        {schema && dateRangeDisclosure.isOpen &&
                            <DateRangeInput defaultValue={dateRange} onChange={onDateRangeChange} mode="range" view="double" />}
                    </Stack>
                    {loading && <HStack justifyContent="center">
                        <Spinner />
                    </HStack>}
                    {!loading &&
                        <>
                            {list?.length ?
                                <Stack w="100%" spacing={4}>
                                    <List spacing={2}>
                                        {list?.map((li, ind) =>
                                            <ActionListItem
                                                leftItem={
                                                    <HStack pl={4}>
                                                        <Checkbox size="lg" />
                                                    </HStack>
                                                }
                                                role="group"
                                                key={ind}
                                                p={0}
                                                pr={4}
                                            >
                                                <HStack>
                                                    <HStack flex={1} >

                                                        <Box flex={1}>
                                                            <Link to={`/admin/explorer/${name}/${li?.id}`}>
                                                                <Text py={4}>
                                                                    {li.name || li.id}
                                                                </Text>
                                                            </Link>
                                                        </Box>
                                                    </HStack>
                                                </HStack>
                                            </ActionListItem>)}
                                    </List>
                                </Stack>
                                : <JumboAlert
                                    title="No entries found"
                                    description="Click here to create one now..."
                                />
                            }
                        </>
                    }
                </>
            </PageBody>
            <PageFooter>
                <HStack flex={1}>
                    <HStack flex={1}>
                        <HStack>
                            <Heading size="xs">Show</Heading>
                            <Select w="100px" onChange={e => setPageSize(parseInt(e.target.value))} defaultValue="10">
                                <SelectOption value="10">10</SelectOption>
                                <SelectOption value="20">20</SelectOption>
                                <SelectOption value="50">50</SelectOption>
                                <SelectOption value="100">100</SelectOption>
                            </Select>
                        </HStack>
                        <Heading size="xs">
                            Showing : {(pagination.page - 1) * pagination.pageSize}-{pagination.page * pagination.pageSize} entries
                        </Heading>
                        <Heading size="xs">
                            Total : {count} entries
                        </Heading>
                    </HStack>
                    <HStack>
                        <Pagination onPageChange={onPageChange} total={count} {...pagination} />
                    </HStack>
                </HStack>
            </PageFooter>
        </Page >
    )
}

export default ListViewPage