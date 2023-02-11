import { PluginObj } from "@reactive/client"
import { Endpoint, toPascalCase } from "@reactive/commons"
import { RXICO_PLUS, RXICO_SEARCH } from "@reactive/icons"
import { Heading, Icon, IconButton, List, ListItem, Page, PageBody, PageHeader, PageToolbar, NameInputModal, Stack, StackProps, TwoColumns, useFormModal } from "@reactive/ui"
import { useEffect, useState } from "react"
import { Link, Outlet, useLocation, useNavigate, useNavigation, useRoutes } from "react-router-dom"

export interface ListEndpointsProps extends StackProps {
    children?: any
}

export type EndpointEditorOutletContext = {
    endpoints: Endpoint[]
    newEndpoint: Endpoint
}

export function ListEndpoints({ children, ...props }: ListEndpointsProps) {
    const [endpoint] = useState(new PluginObj("data-types"))
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const [eps, setEps] = useState<Endpoint[]>([])
    const [newEndpoint, setNewEndpoint] = useState<Endpoint>()
    const nameModal = useFormModal({
        onSubmit({ name }) {
            setNewEndpoint({
                name,
                type: "basic",
                schema: {
                    name
                }
            })
            navigate(name)
        }
    })
    useEffect(() => {
        endpoint.get().then(d => setEps(JSON.parse(d.data)))
    }, [])

    const create = () => {
        endpoint.call("create/temps")
    }

    const basicTypes = newEndpoint?.name ? [...eps, newEndpoint] : eps
    return (
        <TwoColumns>
            <Page>
                <PageHeader>
                    <Heading size="md" >{"Data Types"}</Heading>
                </PageHeader>
                <PageToolbar>
                    <IconButton variant="outline">
                        <Icon>
                            <RXICO_SEARCH />
                        </Icon>
                    </IconButton>
                    {newEndpoint?.name ? "" : <IconButton onClick={(e: any) => nameModal.onOpen()}>
                        <Icon>
                            <RXICO_PLUS />
                        </Icon>
                    </IconButton>
                    }
                </PageToolbar>
                <PageBody>
                    <NameInputModal {...nameModal}>
                    </NameInputModal >
                    <Stack spacing={4}>
                        {basicTypes?.length && <List minW="200px" spacing={2}>
                            {
                                basicTypes?.map((ep, ind) => {
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
            <Outlet context={{ endpoints: eps, newEndpoint }} />
        </TwoColumns >
    )
}

export default ListEndpoints