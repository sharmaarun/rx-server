import { PluginEndpoint } from "@reactive/client"
import { Endpoint, toPascalCase } from "@reactive/commons"
import { RXICO_SEARCH } from "@reactive/icons"
import { Box, Button, Heading, HStack, Icon, IconButton, List, ListItem, Page, PageBody, PageHeader, PageToolbar, Stack, StackProps, TwoColumns } from "@reactive/ui"
import { useEffect, useState } from "react"
import { Link, Outlet, useLocation } from "react-router-dom"

export interface ListEndpointsProps extends StackProps {
    children?: any
}

export function ListEndpoints({ children, ...props }: ListEndpointsProps) {
    const [endpoint] = useState(new PluginEndpoint("data-types"))
    const { pathname } = useLocation()
    const [eps, setEps] = useState<Endpoint[]>([])
    useEffect(() => {
        endpoint.get().then(d => setEps(JSON.parse(d.data)))
    }, [])

    const create = () => {
        endpoint.call("create/temps")
    }
    return (
        <TwoColumns>
            <Page>
                <PageHeader>
                    <Heading size="md" >{"Data Types"}</Heading>
                </PageHeader>
                <PageToolbar>
                    <IconButton>
                        <Icon>
                            <RXICO_SEARCH />
                        </Icon>
                    </IconButton>
                </PageToolbar>
                <PageBody>
                    <Stack spacing={4}>
                        {eps?.length && <List minW="200px" spacing={2}>
                            {
                                eps?.map((ep, ind) => {
                                    const path = "/admin/data-types/" + ep.name
                                    const isActive = path === pathname
                                    return <ListItem
                                        p={2} pl={4}
                                        key={ind}
                                        bgColor={isActive ? "blackAlpha.200" : ""}
                                        // color={isActive ? "whiteAlpha.900" : "blackAlpha.900"}
                                        _hover={{ bgColor: isActive ? "" : "blackAlpha.50" }}
                                        borderRadius={4}
                                        display="flex"
                                        justifyContent="stretch"
                                        alignItems="stretch"
                                        as={Link}
                                        {...({ to: ep.name } as any)}
                                    >
                                        {/* <Link style={{ padding: "10px", height: "100%", width: "100%" }} to={ep.name} key={ind}> */}
                                        {toPascalCase(ep.name)}
                                        {/* </Link> */}
                                    </ListItem>
                                }
                                )
                            }
                        </List>
                        }
                    </Stack>
                </PageBody>
            </Page>
            <Outlet context={{ endpoints: eps }} />
        </TwoColumns >
    )
}

export default ListEndpoints