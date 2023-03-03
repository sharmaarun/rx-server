import { Obj, useAttributes, useEntityObj } from "@reactive/client"
import { Attribute, BaseAttributeType, NumberAttributeSubType, RelationType, toPascalCase } from "@reactive/commons"
import { ActionButton, Card, Field, FieldControl, FieldLabel, Form, Heading, HStack, Input, JumboAlert, Page, PageBackButton, PageBody, PageContent, PageFooter, PageHeader, PageToolbar, Spinner, Stack, StackProps, useToast } from "@reactive/ui"
import { useEffect, useState } from "react"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"
import { ListSchemaOutletContext } from "../index"
export interface EditorPageProps extends StackProps {
    children?: any
    mode?: "create" | "update"
}


export function EditorPage({ children, mode = "update", ...props }: EditorPageProps) {
    const { id, name } = useParams() || {}
    const { obj, get, save, isLoading, isSaving } = useEntityObj({ name })

    const toast = useToast({
        position: "top",
        status: "success"
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
            await save(data, { mode })
            if (mode === "create") {
                navigate(`/admin/explorer/${name}/` + obj?.attributes?.id, { replace: true })
            }
            toast({
                title: "Saved",
                description: "Entry saved successfully"
            })
        } catch (e) {
            toast({
                title: "Error",
                description: e.message || "Server erorr occured"
            })

        }
    }

    const defaultValue: any = {}
    for (let key in obj?.attributes || {}) {
        const attr = Object.values(currentSchema?.attributes)?.find(a => a.name === key)
        console.log("attr is : ", attr?.type)
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

    console.log(defaultValue)

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
                    {...({ onFormChange: console.log })} defaultValue={defaultValue} onSubmit={onSave}
                >
                    <PageBody flex={1} >
                        <>
                            <HStack alignItems="flex-start">
                                <Card shadow="base" p={4} w="80%">
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
                                <Card p={4} w="20%">

                                    <Input />
                                </Card>
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