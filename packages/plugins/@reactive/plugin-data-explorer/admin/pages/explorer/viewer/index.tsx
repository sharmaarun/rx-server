import { Obj, useEntityObj, useServerContext } from "@reactive/client"
import { toPascalCase } from "@reactive/commons"
import { RXICO_CALENDAR, RXICO_FILTER, RXICO_SORT, RXICO_TRASH } from "@reactive/icons"
import { ActionButton, ActionListItem, Box, Checkbox, Heading, HStack, Icon, IconButton, JumboAlert, List, Page, PageBody, PageHeader, PageToolbar, Stack, StackProps, Text, Tooltip, useDisclosure } from "@reactive/ui"
import { parse, stringify } from "qs"
import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import { EntityFilters, FilterDTO } from "../../../components/filters"

export interface ListViewPageProps extends StackProps {
    children?: any
}


export function ListViewPage({ children, ...props }: ListViewPageProps) {
    const { name } = useParams() || {}
    const obj = new Obj(name)
    const { endpoints } = useServerContext()
    const filtersDisclosure = useDisclosure()
    const dateRangeDisclosure = useDisclosure()
    const [clist, setList] = useState([])
    const navigate = useNavigate()
    const { search: searchStr, pathname } = useLocation()

    useEffect(() => {
        setTimeout(async () => {
            const queryObj = parseQueryString(searchStr)
            const res = await obj?.list(queryObj)
            setList(res)

        }, 0)
    }, [name, searchStr])
    const schema = endpoints?.find(ep => ep?.schema?.name === name)?.schema as any

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
        console.log(query)
        for (let name in (query || {})) {
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
            where: filtersToFiltersQuery(filters)
        }
        const queryStr = stringify(queryObj)
        search(queryStr)
    }

    const parseQueryString = (str: string) => {
        const filters = window.location.search
        const queryObj = parse(filters?.substring(1) || "{}") || {}
        return queryObj
    }

    const extractFilters = (str: string) => {
        const { where } = parseQueryString(str) || {}
        if (!where) return [];
        return filtersQueryToFilters(where)
    }

    const filters = extractFilters(searchStr)

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
                        <IconButton aria-label="Date Range">
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
                    <Tooltip label="Sort">
                        <IconButton aria-label="Sort">
                            <Icon>
                                <RXICO_SORT />
                            </Icon>
                        </IconButton>
                    </Tooltip>
                    <Link to={`/admin/explorer/${name}/new`}>
                        <Tooltip label={`Add New ${toPascalCase(name || "")}`}>
                            <ActionButton colorScheme="purple" >Add New {toPascalCase(name || "")}</ActionButton>
                        </Tooltip>
                    </Link>
                </HStack>
            </PageToolbar>
            <PageBody>
                <>
                    <Stack bg="gray.50" zIndex={2} position="sticky" top={0} pb={4}>
                        {schema && filtersDisclosure.isOpen &&
                            <EntityFilters defaultValue={filters} schema={schema} onChange={onFiltersChange} />}
                        <HStack>
                            <Heading size="xs" flex={1}>
                                Total : {clist.length} Entries
                            </Heading>

                        </HStack>
                    </Stack>
                    {clist?.length ?
                        <Stack w="100%" spacing={4}>
                            <List spacing={2}>
                                {clist?.map((li, ind) =>
                                    <ActionListItem role="group" key={ind} p={0} pr={4}>
                                        <HStack>
                                            <HStack flex={1} pl={4}>
                                                <Checkbox size="lg" />
                                                <Box flex={1}>
                                                    <Link to={`/admin/explorer/${name}/${li?.id}`}>
                                                        <Text py={4}>
                                                            {li.name || li.id}
                                                        </Text>
                                                    </Link>
                                                </Box>
                                            </HStack>
                                            <HStack>
                                                <IconButton _groupHover={{ visibility: "visible" }} visibility="hidden" variant="ghost" aria-label="">
                                                    <Icon>
                                                        <RXICO_TRASH />
                                                    </Icon>
                                                </IconButton>
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
            </PageBody>
        </Page >
    )
}

export default ListViewPage