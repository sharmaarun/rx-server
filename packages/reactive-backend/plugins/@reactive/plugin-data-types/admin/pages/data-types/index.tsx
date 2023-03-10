import { PluginObj } from "@reactive/client"
import { EntitySchema, toPascalCase } from "@reactive/commons"
import { RXICO_PLUS, RXICO_SEARCH } from "@reactive/icons"
import { Heading, Icon, IconButton, List, ListItem, NameInputModal, Page, PageBody, PageHeader, PageSearchProvider, PageToolbar, Stack, StackProps, TwoColumns, useFormModal, useToast } from "@reactive/ui"
import { ValidationError } from "class-validator"
import { useEffect, useState } from "react"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"

export interface ListSchemasProps extends StackProps {
    children?: any
}

export type SchemaEditorOutletContext = {
    schemas: EntitySchema[]
    newSchema: EntitySchema
    onSave: (obj: EntitySchema) => void | Promise<void>
    onDelete: (obj: EntitySchema) => void | Promise<void>
}

export function ListSchemas({ children, ...props }: ListSchemasProps) {
    const [schema] = useState(new PluginObj("data-types", {
        objectIdKey: "name"
    }))
    const toast = useToast()
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const [eps, setEps] = useState<EntitySchema[]>([])
    const [newSchema, setNewSchema] = useState<EntitySchema>()
    const [nameModalErrors, setNameModalErrors] = useState<any[]>([])
    const nameModal = useFormModal({
        onSubmit({ name }) {
            const lcName = name?.toLowerCase?.()
            if (eps?.find(ep => ep.name?.toLowerCase() === lcName)) {
                setNameModalErrors([{
                    property: "name",
                    constraints: { "exists": "Already exists" }
                }])
                throw new Error("Already exists")
            }
            setNewSchema({
                name: lcName
            })
            navigate(lcName)
        }
    })
    useEffect(() => {
        fetchSchemas()
    }, [])

    const fetchSchemas = async () => setEps(await schema.list())

    const save = async (obj: EntitySchema) => {
        if (!obj?.name || Object.keys(obj?.attributes || {}).length <= 0) {
            toast({
                title: "Error",
                description: "Please add at least one attribute!",
                position: "top",
                status: "error"
            })
            return
        }
        schema.set(obj)
        await schema.save({}, { mode: newSchema?.name ? "create" : "update" })
        toast({
            title: "Success",
            description: "All changes were applied correctly. Server will now restart for the changes to take effect...",
            status: "success",
            position: "top"
        })

        reload()
        // fetchSchemas()
    }

    const reload = () => {
        if (typeof window !== "undefined") {
            setTimeout(() => {
                window.location.href = "."
            }, 3000)
        }
    }

    const onDelete = async (obj: EntitySchema) => {
        schema.set(obj)
        await schema.delete(schema?.attributes.name)
        toast({
            title: "Success",
            description: "The endpoint was deleted. Server will now restart for the changes to take effect...",
            position: "top",
            status: "success"
        })
        reload()
    }

    const basicTypes = newSchema?.name ? [...eps, newSchema] : eps
    return (
        <TwoColumns>
            <Page>
                <PageHeader>
                    <Heading size="md" >{"Data Types"}</Heading>
                </PageHeader>
                <PageToolbar>
                    <PageSearchProvider />
                    {newSchema?.name ? "" : <IconButton aria-label="" onClick={(e: any) => nameModal.onOpen()}>
                        <Icon>
                            <RXICO_PLUS />
                        </Icon>
                    </IconButton>
                    }
                </PageToolbar>
                <PageBody>
                    {({ search }) =>
                        <><NameInputModal {...nameModal} errors={nameModalErrors}>
                        </NameInputModal >
                            <Stack spacing={4}>
                                {basicTypes?.length && <List minW="200px" spacing={2}>
                                    {
                                        basicTypes?.filter(ep => search?.length ? ep.name.includes(search) : true).map((ep, ind) => {
                                            const path = "/admin/data-types/" + ep?.name
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
                                                {...({ to: ep?.name } as any)}
                                            >
                                                {/* <Link style={{ padding: "10px", height: "100%", width: "100%" }} to={ep.name} key={ind}> */}
                                                {ep && toPascalCase(ep.name)}
                                                {/* </Link> */}
                                            </ListItem>
                                        }
                                        )
                                    }
                                </List>
                                }
                            </Stack>
                        </>
                    }
                </PageBody>
            </Page>
            <Outlet context={{ schemas: eps, newSchema, onSave: save, onDelete }} />
        </TwoColumns >
    )
}

export default ListSchemas