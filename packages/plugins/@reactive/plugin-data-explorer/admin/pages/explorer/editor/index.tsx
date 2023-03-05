import { confirmDelete, useAttributes, useEntityObj } from "@reactive/client"
import { Attribute, BaseAttributeType, NumberAttributeSubType, toPascalCase } from "@reactive/commons"
import { RXICO_CALENDAR, RXICO_EDIT, RXICO_TRASH } from "@reactive/icons"
import { ActionButton, Card, Field, Anchor, FieldControl, FieldLabel, Form, Heading, HStack, Icon, Input, LinkListItem, Page, PageBackButton, PageBody, PageContent, PageFooter, PageHeader, Spinner, Stack, StackProps, Tag, Text, useToast, DeleteAlertModal } from "@reactive/ui"
import { ValidationError } from "class-validator"
import { format, formatDistance } from "date-fns"
import { useEffect, useState } from "react"
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom"
import { ListSchemaOutletContext } from "../index"
export interface EditorPageProps extends StackProps {
    children?: any
    mode?: "create" | "update"
}


export function EditorPage({ children, mode = "update", ...props }: EditorPageProps) {
    const { id, name } = useParams() || {}
    const { obj, get, save, remove, isRemoving, isLoading, isSaving } = useEntityObj({ name })
    const [errors, setErrors] = useState<ValidationError[]>([])
    const toast = useToast({
        position: "top-right",
        status: "success",
        isClosable: true
    })
    const navigate = useNavigate()
    const { attributes } = useAttributes()
    const { schemas } = useOutletContext<ListSchemaOutletContext>()

    const currentSchema = schemas?.find(s => s.name === name)

    useEffect(() => {
        if (!id || !currentSchema?.attributes) return
        setTimeout(async () => {
            await get(id, {
                include: Object.values(currentSchema?.attributes || {})
                    ?.filter(attr => attr.type === BaseAttributeType.relation)
                    ?.map(attr => ({
                        association: attr.name,
                        attributes: ["id"]
                    }))
            })
        }, 0)
    }, [id, currentSchema])

    const getRegisteredAttribute = (attr: Attribute) => {
        let regAttr = attributes?.find(rattr =>
            rattr.attribute.customType === attr.customType
        )
        if (!regAttr) {
            regAttr = attributes?.find(rattr =>
                rattr.attribute.customType === attr.type
            )

        }
        return regAttr
    }

    const getFieldType = (attribute: Attribute): any => {
        switch (attribute.type) {
            case BaseAttributeType.boolean:
                return "boolean"
            case BaseAttributeType.number:
                return (attribute?.subType === NumberAttributeSubType.float ||
                    attribute?.subType === NumberAttributeSubType.decimal) ? "float" : "number"
            default:
                return;
        }
    }

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

    const defaultValue: any = {}
    for (let key in obj?.attributes || {}) {
        const attr = Object.values(currentSchema?.attributes)?.find(a => a.name === key)
        if (attr && attr.type === BaseAttributeType.relation && attr.name) {
            const ev = obj?.attributes?.[attr.name]
            defaultValue[attr.name] =
                Array.isArray(ev) ?
                    ev?.map(e => e?.id || e) :
                    (ev?.id || ev)
            continue;
        }
        defaultValue[attr?.name || key] = obj?.attributes?.[attr?.name || key]
    }

    return (
        <Page>
            <PageHeader>
                <HStack>
                    <PageBackButton variant="ghost" />
                    <Heading size="md">
                        {mode === "create" ? "Add New " : "Edit "} {toPascalCase(name || id || "")}
                    </Heading>
                </HStack>
            </PageHeader>

            {isLoading && <PageBody p={12} alignItems="center">
                <Spinner />
            </PageBody>
            }

            {!isLoading &&
                (mode === "create" || (mode === "update" && id && defaultValue?.id)) &&
                <PageContent as={Form}
                    style={{
                        display: "flex",
                        flex: 1,
                        overflow: "hidden",
                        flexDirection: "column"
                    }}
                    {...({ onFormChange: console.log, errors })}
                    defaultValue={defaultValue}
                    onSubmit={onSave}

                >
                    <PageBody flex={1} >
                        <>
                            <HStack alignItems="flex-start">
                                <Card shadow="base" p={4} flex={1}>
                                    <HStack flexWrap="wrap" spacing={0} alignItems="flex-start" justifyContent="space-between">
                                        {Object.values(currentSchema?.attributes || {})?.map((attr, ind) => {
                                            const rattr = getRegisteredAttribute(attr)
                                            const { valueEditor: ValueEditor } = rattr?.metadata?.components || { valueEditor: Input }

                                            return <FieldControl py={2} key={ind} w={["full", "full", "49%"]}>
                                                <FieldLabel>{toPascalCase(attr.name)}</FieldLabel>
                                                <Field name={attr.name} type={getFieldType(attr)}>
                                                    <ValueEditor attribute={attr} schema={currentSchema} autoFocus={ind === 0} />
                                                </Field>
                                            </FieldControl>
                                        }
                                        )}
                                    </HStack>
                                </Card>
                                <Stack w="25%">
                                    <Card p={4} >
                                        <Stack spacing={6}>
                                            {obj?.attributes?.id ? <>
                                                <Stack>
                                                    <HStack alignItems="flex-start">
                                                        <Icon>
                                                            <RXICO_CALENDAR />
                                                        </Icon>
                                                        <Stack>
                                                            <Heading size="sm">Creation Date</Heading>
                                                            <Text fontSize="xs">{format(new Date(obj?.attributes?.createdAt), "dd-MM-yyyy HH:mm a")} ({formatDistance(new Date(obj?.attributes?.createdAt), new Date())})</Text>
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
                                                            <Text fontSize="xs">{format(new Date(obj?.attributes?.updatedAt), "dd-MM-yyyy HH:mm a")} ({formatDistance(new Date(obj?.attributes?.updatedAt), new Date())})</Text>
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
                                            </> : ""}
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
                                        </Stack>
                                    </Card>
                                </Stack>
                            </HStack>
                            <ActionButton type="submit" hidden={true} />
                        </>
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