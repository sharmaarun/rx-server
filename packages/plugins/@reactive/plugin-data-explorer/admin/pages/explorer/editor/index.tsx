import { confirmDelete, useEntityObj } from "@reactive/client"
import { BaseAttributeType, toPascalCase } from "@reactive/commons"
import { RXICO_CALENDAR, RXICO_CHEVRON_RIGHT, RXICO_EDIT, RXICO_TRASH } from "@reactive/icons"
import { ActionButton, Anchor, Card, EntityEditor, EntityEditorFieldsRenderer, Heading, HStack, Icon, Page, PageBackButton, PageBody, PageContent, PageFooter, PageHeader, Spinner, Stack, StackProps, Tag, Text, useToast } from "@reactive/ui"
import { ValidationError } from "class-validator"
import { format, formatDistance } from "date-fns"
import { useEffect, useState } from "react"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"
import { ListSchemaOutletContext } from "../index"

export const EntityInfoBox = ({ data, schema, onRemoveClick }: any) => {
    const navigate = useNavigate()
    const { name } = schema || {}
    return <>
        {data?.id ? <>
            <Stack>
                <HStack alignItems="flex-start">
                    <Icon>
                        <RXICO_CALENDAR />
                    </Icon>
                    <Stack>
                        <Heading size="sm">Creation Date</Heading>
                        <Text fontSize="xs">{format(new Date(data?.createdAt), "dd-MM-yyyy HH:mm a")} ({formatDistance(new Date(data?.createdAt), new Date())})</Text>
                    </Stack>
                </HStack>
            </Stack>
            <Stack>
                <HStack alignItems="flex-start">
                    <Icon>
                        <RXICO_CALENDAR />
                    </Icon>
                    <Stack>
                        <Heading size="sm">Last Updated</Heading>
                        <Text fontSize="xs">{format(new Date(data?.updatedAt), "dd-MM-yyyy HH:mm a")} ({formatDistance(new Date(data?.updatedAt), new Date())})</Text>
                    </Stack>
                </HStack>
            </Stack>
            <Stack>
                <HStack alignItems="flex-start">
                    <Icon color="red.500">
                        <RXICO_TRASH />
                    </Icon>
                    <Stack>
                        <Heading size="sm">
                            <Anchor onClick={onRemoveClick}>Delete Entry</Anchor>
                        </Heading>
                        <Text fontSize="xs">
                            Remove this entry from DB
                        </Text>
                    </Stack>
                </HStack>
            </Stack>
        </> : ""
        }
        <Stack>
            <HStack alignItems="flex-start">
                <Icon color="purple.500">
                    <RXICO_EDIT />
                </Icon>
                <Stack>
                    <Heading size="sm">
                        <Anchor onClick={() => navigate(`/admin/data-types/${name}`)}>Edit Data Type</Anchor>
                    </Heading>
                    <Text fontSize="xs">
                        Edit `{name}` data type
                    </Text>
                </Stack>
            </HStack>
        </Stack>
    </>
}

export interface EditorPageProps extends StackProps {
    children?: any
    mode?: "create" | "update"
}

export function EditorPage({ children, mode = "update", ...props }: EditorPageProps) {
    const { id, name } = useParams() || {}
    const { obj, get, save, remove, isLoading, isGetting, isSaving } = useEntityObj({ name })
    const [errors, setErrors] = useState<ValidationError[]>([])
    const toast = useToast({
        position: "top-right",
        status: "success",
        isClosable: true
    })
    const navigate = useNavigate()
    const { schemas } = useOutletContext<ListSchemaOutletContext>()
    const currentSchema = schemas?.find(s => s.name === name)

    useEffect(() => {
        if (!id || !currentSchema || !currentSchema.attributes) return
        setTimeout(async () => {
            await get(id,
                {
                    include: Object.values(currentSchema?.attributes || {})
                        ?.filter(attr => attr.type === BaseAttributeType.relation)
                        ?.map(attr => ({
                            association: attr.name,
                            attributes: ["id"],
                        } as any))
                }
            )
        }, 0)
    }, [id, currentSchema])


    const onSave = async (data?: any) => {
        try {
            setErrors([])
            await save(data, { mode })
            if (mode === "create") {
                navigate(`/admin/explorer/${name}/` + obj?.attributes?.id, { replace: true })
            }
            toast({
                title: "Saved",
                description: "Entry saved successfully"
            })
        } catch (e) {
            if (e.errors?.length) {
                setErrors(e.errors)
            }
            toast({
                title: "Error",
                status: "error",
                description: e.message || "Server erorr occured"
            })

        }
    }

    const onRemoveClick = () => {
        confirmDelete(onRemove)
    }

    const onRemove = async () => {
        try {
            await remove()
            toast({
                title: "Success",
                description: "Entry was deleted"
            })
            navigate(`/admin/explorer/${name}`)
        } catch (e) {
            if (e.errors?.length) {
                setErrors(e.errors)
            }
            toast({
                title: "Error",
                status: "error",
                description: e.message || "Server erorr occured"
            })
            console.error(e)
        }
    }

    return (
        <Page>
            <PageHeader>
                <HStack>
                    <PageBackButton variant="ghost" />
                    <Heading size="md">
                        {mode === "create" ? "Add New " : "Edit "} {toPascalCase(name || "")}
                    </Heading>
                    {id && id.length >= 0 ?
                        <>
                            <Icon><RXICO_CHEVRON_RIGHT /></Icon>
                            <Tag colorScheme="purple">ID : {toPascalCase(id || "")}</Tag>
                        </>
                        : ""}
                </HStack>
            </PageHeader>


            {(isLoading || isGetting) && <PageBody p={12} alignItems="center">
                <Spinner />
            </PageBody>
            }
            {!isLoading && !isGetting &&
                <PageContent
                    as={EntityEditor}
                    {...({
                        onSubmit: onSave,
                        errors: errors,
                        defaultValue: obj.attributes || {},
                        entityName: name,
                    })}
                >
                    <PageBody>
                        <HStack alignItems="flex-start">
                            <Card shadow="base" p={4} flex={1}>
                                <EntityEditorFieldsRenderer entityName={name} />
                                <ActionButton type="submit" hidden={true} />
                            </Card>
                            <Stack w="25%">
                                <Card p={4} >
                                    <Stack spacing={6}>
                                        <EntityInfoBox
                                            schema={currentSchema}
                                            data={obj.attributes}
                                            onRemoveClick={onRemoveClick}
                                        />
                                    </Stack>
                                </Card>
                            </Stack>
                        </HStack>
                    </PageBody>
                    <PageFooter>
                        <ActionButton isLoading={isSaving} isDisabled={isSaving} type="submit">Save</ActionButton>
                    </PageFooter>
                </PageContent>
            }
        </Page >
    )
}



export default EditorPage