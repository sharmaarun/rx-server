import { confirmDelete, useEntityObj } from "@reactive/client"
import { RXICO_TRASH } from "@reactive/icons"
import { ActionButton, Anchor, Card, EntityEditor, EntityEditorFieldsRenderer, Heading, HStack, Icon, Page, PageBackButton, PageBody, PageContent, PageFooter, PageHeader, PageProps, Spinner, Stack, Text, useToast } from "@reactive/ui"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

export interface RolesEditorPageProps extends PageProps {
    children?: any
}

export function RolesEditorPage({ children, ...props }: RolesEditorPageProps) {
    const { id } = useParams()
    const navigate = useNavigate()
    const [mode, setMode] = useState<"create" | "update">("create")
    const { get, save, remove, errors, isGetting, isSaving, isLoading, obj } = useEntityObj({
        name: "role"
    })
    const toast = useToast({
        position: "top-right",
        status: "success",
        isClosable: true
    })

    const data = obj?.attributes || {}

    useEffect(() => {
        if (id?.length > 0) {
            fetch(id)
            setMode("update")
        }
    }, [id])

    const fetch = async (id) => {
        if (id.length) {
            try {
                await get(id, {
                    include: [
                        {
                            association: "users",
                            attributes: ["id"]
                        }
                    ]
                })
            } catch (e) {
                toast({ title: "Error", status: "error", description: e.message })
                console.log(e)
            }
        }
    }

    const onSave = async (newData: any) => {
        try {
            await save(newData, { mode })
            toast({ title: "Success", description: "Role saved" })
            if (mode === "create") {
                navigate("../" + obj?.attributes?.id, {replace:true})
            }
        } catch (e) {
            toast({ title: "Error", status: "error", description: e.message })
            console.error(e)
        }
    }
    const onRemove = async () => {
        try {
            await remove()
            toast({ title: "Success", description: "Role removed" })
            navigate("..")
        } catch (e) {
            toast({ title: "Error", status: "error", description: e.message })
            console.error(e)
        }
    }
    return (
        <Page>
            <PageHeader>
                <HStack>
                    <PageBackButton variant="ghost" />
                    <Heading size="md">
                        {id?.length ? `Edit ${data?.name}` : "Add Role"}
                    </Heading>
                </HStack>
            </PageHeader>
            {(isLoading || isGetting) && <PageBody alignItems="center">
                <Spinner />
            </PageBody>}
            {!isLoading && !isGetting &&
                <PageContent as={EntityEditor}
                    {...({
                        onSubmit: onSave,
                        errors: errors,
                        defaultValue: data,
                    })}
                >
                    <PageBody>
                        <HStack alignItems="flex-start">
                            <Card p={4} w="80%">
                                <EntityEditorFieldsRenderer mode={mode} entityName="role" />
                                <ActionButton type="submit" hidden>Save</ActionButton>
                            </Card>
                            <Card p={4} w="20%">
                                <HStack alignItems="flex-start">
                                    <Icon color="red.500">
                                        <RXICO_TRASH />
                                    </Icon>
                                    <Stack spacing={1}>
                                        <Anchor onClick={e => confirmDelete(onRemove)}>
                                            <Heading size="sm">
                                                Delete Role
                                            </Heading>
                                        </Anchor>
                                        <Text fontSize="xs">
                                            Delete this role
                                        </Text>
                                    </Stack>
                                </HStack>
                            </Card>
                        </HStack>
                    </PageBody>
                    <PageFooter>
                        <ActionButton
                            isDisabled={isLoading || isSaving}
                            isLoading={isLoading || isSaving}
                            type="submit"
                        >
                            Save
                        </ActionButton>
                    </PageFooter>
                </PageContent >
            }
        </Page >
    )
}

export default RolesEditorPage