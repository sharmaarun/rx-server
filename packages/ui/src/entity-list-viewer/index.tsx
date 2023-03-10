import "reflect-metadata"
//=====
import { useDisclosure } from "@chakra-ui/react"
import { useServerContext } from "@reactive/client"
import { Operator, Query, QueryOrderItem, toPascalCase } from "@reactive/commons"
import { RXICO_CALENDAR, RXICO_FILTER } from "@reactive/icons"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { JumboAlert } from "../alert"
import { Box } from "../box"
import { ActionButton } from "../button"
import { Checkbox } from "../checkbox"
import { Heading } from "../heading"
import { Icon, IconButton } from "../icon"
import { ActionListItem, List } from "../list"
import { Pagination } from "../pagination"
import { Select, SelectOption } from "../select"
import { HStack, HStackProps, Stack, StackProps } from "../stack"
import { Text } from "../text"
import { Tooltip } from "../tooltip"
import { DateRangeInput } from "./date-range"
import { EntityFilters, FilterDTO } from "./filters"
import { SortMenu } from "./sort"
export * from "./date-range"
export * from "./filters"
export * from "./sort"

const tids: any = {}
export type UseEntityListViewOpts = {
    onSearch?: (query: Query) => void
    query?: Query
    count?: number
    data?: any[]
    defaultPageSize?: number
}

export const useEntityListView = (name: string, {
    onSearch,
    query,
    count = 0,
    data = [],
    defaultPageSize = 10
}: UseEntityListViewOpts) => {

    const { endpoints } = useServerContext()
    const filtersDisclosure = useDisclosure()
    const dateRangeDisclosure = useDisclosure()
    const schema = endpoints?.find(ep => ep?.schema?.name === name)?.schema as any
    const [pageSize, setPageSize] = useState(defaultPageSize)
    const [queryObject, setQueryObject] = useState<Query>(query || {})

    // useEffect(() => {
    //     if (JSON.stringify(queryObject) !== JSON.stringify(query)) {
    //         setQueryObject({ ...query })
    //     }
    // }, [query])

    useEffect(() => {
        filtersDisclosure.onClose()
        dateRangeDisclosure.onClose()
    }, [name])



    useEffect(() => {
        const { pagination }: Query = queryObject
        onPageChange(pagination?.page ?? 1)
    }, [pageSize])

    useEffect(() => {
        search?.(queryObject)
    }, [queryObject])

    const search = (query_: Query) => {
        onSearch?.(query_)
    }

    const filtersToFiltersQuery = (filters: FilterDTO[]) => {
        const filters_: any = {}
        for (let filter of filters || []) {
            if (filter.attributeName && filter.key) {
                filters_[filter.attributeName] = {
                    [filter.key]: filter.value
                }
            }
        }
        return filters_
    }
    const filtersQueryToFilters = (query_: any) => {
        const filters: FilterDTO[] = []
        for (let name in (query_ || {})) {
            if (["createdAt"].includes(name)) continue;
            for (let key in (query_[name] || {})) {
                let filter = new FilterDTO()
                filter.attributeName = name
                filter.key = key
                filter.value = query_[name][key]
                filters.push(filter)
            }
        }
        return filters
    }

    const onFiltersChange = (filters: FilterDTO[]) => {
        const queryObj = {
            ...(queryObject),
            where: filtersToFiltersQuery(filters)
        }
        setQueryObject(queryObj)
        // search(queryObj)
    }

    const onDateRangeChange = (dateRange: Date[]) => {

        const createdAt: any = {}
        if (dateRange[0]) {
            createdAt[Operator.gte] = dateRange[0]
        }
        if (dateRange[1]) {
            createdAt[Operator.lte] = dateRange[1]
        }
        let { where, ...queryObj }: Query = queryObject
        queryObj = {
            ...queryObj,
            where: {
                ...(where || {}),
                // ...(Object.keys(createdAt).length > 0 ? { createdAt } : {})
                createdAt
            }
        } as Query
        setQueryObject(queryObj)
        // search(queryObj)
        if (dateRange.length <= 0) {
            dateRangeDisclosure.onClose()
        }
    }

    const onPageChange = (page: number) => {
        if (page <= 0 || page > ((count / pageSize) + 1)) return
        const { pagination, ...rest }: Query = queryObject
        const queryObj = {
            ...(rest || {}),
            pagination: {
                ...pagination,
                page: parseInt(page + ""),
                pageSize: parseInt(pageSize + "")
            }
        }
        setQueryObject(queryObj)
        // search(queryObj)
    }

    const onSortChange = (value: QueryOrderItem) => {
        const { order, ...rest }: Query = queryObject
        const queryObj: Query = {
            ...(rest || {}),
            order: [value]
        }
        setQueryObject(queryObj)
        // search(queryObj)
    }

    const { where = {}, pagination = {
        page: 1,
        pageSize
    }, order = [] }: Query = queryObject
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

    return {
        filters,
        pagination,
        count,
        data,
        schema,
        pageSize,
        filtersDisclosure,
        dateRangeDisclosure,
        dateRange,
        order,
        setPageSize,
        onSortChange,
        onPageChange,
        onDateRangeChange,
        onFiltersChange,
        name
    }
}

export type UseEntityListViewReturnType = ReturnType<typeof useEntityListView>
export const EntityListViewerContext = createContext<UseEntityListViewReturnType>({} as any)
export const useEntityListViewerContext = () => useContext(EntityListViewerContext)


export interface EntityListViewerProps extends Partial<UseEntityListViewOpts> {
    entityName: string
    children?: any
}

export const EntityListViewer = ({
    children,
    entityName,
    ...props }: EntityListViewerProps) => {
    const ctx = useEntityListView(entityName, props)
    return (
        <EntityListViewerContext.Provider value={ctx} {...props}>
            {children}
        </EntityListViewerContext.Provider>
    )
}

export const EntityListViewerPageSize = {
    "Ten": 10,
    "Twenty": 20,
    "Fifty": 50,
    "Hundred": 100
}
export interface EntityListViewerPageSizeSelectorProps extends Omit<HStackProps, "onChange"> {
    children?: any
    defaultValue?: number
}

export const EntityListViewerPageSizeSelector = ({ children, defaultValue, ...props }: EntityListViewerPageSizeSelectorProps) => {
    const { setPageSize } = useEntityListViewerContext()
    return (
        <HStack {...props}>
            <Heading size="xs">Show</Heading>
            <Select w="100px" onChange={e => setPageSize?.(parseInt(e.target.value))} defaultValue={defaultValue || 10}>
                {Object.values(EntityListViewerPageSize).map((s, ind) =>
                    <SelectOption key={ind} value={s}>{s}</SelectOption>
                )}

            </Select>
        </HStack>
    )
}

export interface EntityListViewerPaginationProps extends Omit<HStackProps, "onChange"> {
    children?: any
}

export const EntityListViewerPagination = ({ children, ...props }: EntityListViewerPaginationProps) => {
    const { count, pagination, onPageChange, } = useEntityListViewerContext()
    const { page = 1, pageSize = 10 } = pagination || {}

    return (
        <HStack {...props}>
            <Heading size="xs">
                Showing : {(page - 1) * pageSize}-{page * pageSize} entries
            </Heading>
            <Heading size="xs">
                Total : {count} entries
            </Heading>
            <Pagination onPageChange={onPageChange} total={count} page={page} pageSize={pageSize} />
        </HStack>
    )
}

export interface EntityListViewerBodyProps extends HStackProps {
    children?: any
    listItemRenderer?: (item: any, index: number) => ReactNode
}

export const EntityListViewerBody = ({
    children,
    listItemRenderer,
    ...props
}: EntityListViewerBodyProps) => {
    const {
        name,
        data,
    } = useEntityListViewerContext()
    return (
        <>
            <Stack>
                {children}
            </Stack>
            {data?.length ?
                <Stack w="100%" spacing={4}>
                    <List spacing={2}>
                        {data?.map((li, ind: number) => {
                            return listItemRenderer ?
                                listItemRenderer(li, ind) :
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
                                                {/* <Link to={`/admin/explorer/${name}/${li?.id}`}> */}
                                                <Text py={4}>
                                                    {li.name || li.id}
                                                </Text>
                                                {/* </Link> */}
                                            </Box>
                                        </HStack>
                                    </HStack>
                                </ActionListItem>
                        })}
                    </List>
                </Stack>
                : <JumboAlert
                    title="No entries found"
                    description="Click here to create one now..."
                />
            }
        </>
    )
}




export interface EntityListViewerHeaderProps extends HStackProps {
    title?: any
}

export const EntityListViewerHeader = ({
    children,
    title,
    ...props
}: EntityListViewerHeaderProps) => {

    return (
        <HStack {...props}>
            <Heading size="md">
                {title || "Listing"}
            </Heading>
        </HStack>
    )
}

export interface EntityListViewerToolbarProps extends HStackProps {
    title?: any
}

export const EntityListViewerToolbar = ({
    children,
    title,
    ...props
}: EntityListViewerToolbarProps) => {
    return (
        <HStack justifyContent="flex-end" {...props}>
            {children}
        </HStack>
    )
}



export const EntityListViewerFiltersEditor = () => {
    const { filters, schema, onFiltersChange, filtersDisclosure } = useEntityListViewerContext()
    return (filtersDisclosure?.isOpen) ?
        <EntityFilters defaultValue={filters} schema={schema} onChange={onFiltersChange} />
        : <></>
}

export const EntityListViewerDateRangeSelector = () => {
    const { dateRange, schema, dateRangeDisclosure, onDateRangeChange } = useEntityListViewerContext()
    return (dateRangeDisclosure?.isOpen) ?
        <DateRangeInput defaultValue={dateRange} onChange={d => onDateRangeChange(d as Date[])} mode="range" view="double" /> :
        <></>
}

export const EntityListViewerDateRangeSelectorToggleButton = () => {
    const { dateRangeDisclosure, dateRange } = useEntityListViewerContext()
    return <Tooltip label="Date Range">
        <IconButton
            onClick={dateRangeDisclosure?.onToggle}
            aria-label="Date Range"
            isActive={dateRange?.length > 0 || dateRangeDisclosure?.isOpen}
        >
            <Icon>
                <RXICO_CALENDAR />
            </Icon>
        </IconButton>
    </Tooltip>
}

export const EntityListViewerFiltersEditorToggleButton = () => {
    const { filtersDisclosure, filters } = useEntityListViewerContext()
    return <Tooltip label="Filters">
        <IconButton
            isActive={filters?.length > 0 || filtersDisclosure?.isOpen}
            onClick={e => filtersDisclosure?.onToggle?.()}
            aria-label="Filters"
        >
            <Icon>
                <RXICO_FILTER />
            </Icon>
        </IconButton>
    </Tooltip>

}

export const EntityListViewerSortMenu = () => {
    const { order, onSortChange, schema } = useEntityListViewerContext()
    return <SortMenu value={order?.[0]} onChange={onSortChange} schema={schema} />

}

export const EntityListViewerAddNewButton = () => {
    const { name } = useEntityListViewerContext()
    return <Tooltip label={`Add New ${toPascalCase(name || "")}`}>
        <ActionButton colorScheme="purple" >Add New {toPascalCase(name || "")}</ActionButton>
    </Tooltip>

}