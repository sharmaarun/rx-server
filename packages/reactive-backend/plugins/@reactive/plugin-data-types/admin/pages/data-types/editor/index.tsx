import { confirmDelete, RegisteredAttribute, useAttributes } from "@reactive/client"
import { EntitySchema, Attribute, toPascalCase } from "@reactive/commons"
import { RXICO_EDIT, RXICO_TRASH } from "@reactive/icons"
import { ActionButton, Box, Button, Card, DeleteAlertModal, FormContext, Heading, HStack, Icon, IconButton, JumboAlert, List, ListItem, Page, PageBody, PageFooter, PageHeader, PageToolbar, Stack, StackProps, Text, useDisclosure } from "@reactive/ui"
import { ValidationError } from "class-validator"
import { useEffect, useState } from "react"
import { useOutletContext, useParams } from "react-router-dom"
import { SchemaEditorOutletContext } from ".."
import { AttributeEditorModal } from "../../../components/attribute-editor-modal"
import { AttributeSelectionModal } from "../../../components/attribute-selection-modal"
export interface EditorPageProps extends StackProps {
    children?: any
}


export function EditorPage({ children, ...props }: EditorPageProps) {
    const { name } = useParams() || {}
    const { attributes } = useAttributes()
    const { schemas = [], newSchema, onSave, onDelete } = useOutletContext<SchemaEditorOutletContext>() || {}
    const attributeSelectionModal = useDisclosure()

    const [errors, setErrors] = useState<ValidationError[]>([])
    const [toDelete, setToDelete] = useState<Attribute>()
    const [newAttribute, setNewAttribute] = useState<Attribute>()
    const [schema, setSchema] = useState<EntitySchema>()

    useEffect(() => {
        const ep = getSchema(name)
        if (ep) {
            setSchema(JSON.parse(JSON.stringify({ ...ep })))
        }
    }, [name, schemas, newSchema])
    const { name: epName } = schema || {}
    // const schemaAttrs = schema?.attributes
    const schemaAttrs = Object.keys(schema?.attributes || {}).filter(name => schema?.attributes?.[name]).map(name => ({ ...(schema?.attributes?.[name] || {}) }))
    const [mode, setMode] = useState<"edit" | "new">("new")

    const getSchema = (name?: string) => [...schemas, ...(newSchema ? [newSchema] : [])]?.find?.((ep: any) => ep?.name === name)

    const onSelectAttribute = (attribute: Omit<Attribute, "name">) => {
        setNewAttribute(attribute as any)
        setErrors([])
        attributeSelectionModal.onClose()
    }

    const saveAttribute = (attribute: Attribute) => {
        if (schema && attribute.name) {
            schema.attributes = schema.attributes || {}
            const exists = schema.attributes?.[attribute.name]
            if (mode === "edit" && !exists) throw new Error("Can't edit a attribute that doesn't exist!")
            if (exists) {
                Object.assign(exists, attribute)
            } else {
                schema.attributes[attribute.name] = attribute
            }

            setSchema({ ...schema })
        }
    }

    const removeAttribute = (attribute: Attribute) => {
        if (schema && schema?.attributes && schema.attributes[attribute.name]) {
            schema.attributes[attribute.name] = undefined as any
            delete schema.attributes[attribute.name]
            setSchema({ ...schema })
        }
    }

    const beforeSaveAttributeMiddleware = ({ value }: FormContext) => {
        if (schema && schema && schema.attributes && value.name) {
            setErrors([])
            const exists = schema.attributes?.[value.name]
            if (mode === "new" && exists) {
                setErrors([{
                    property: "name",
                    constraints: { "exists": "Already exists" }
                }])
                throw new Error("Attribute already exists")
            }
        }

    }

    const saveSchema = () => {
        if (schema)
            onSave?.(schema)
    }

    const deleteAllAttributes = () => {
        if (schema && schema.attributes) {
            schema.attributes = undefined
            delete schema.attributes
            setSchema({ ...schema })
        }
    }

    const deleteAttribute = (attr: any) => {
        if (attr?.name) {
            removeAttribute(attr)
        }
    }

    const attributes_ = [...attributes]
    const schema_ = getSchema(name)
    const changed = schema_ && schema && JSON.stringify(schema) !== JSON.stringify(schema_)

    return (
        <>
            {
                epName ?
                    <Page>
                        <PageHeader>
                            <HStack>
                                <Heading size="md">
                                    Data Type : {toPascalCase(epName || "")}
                                </Heading>
                                <IconButton
                                    aria-label=""
                                    variant="ghost"
                                    colorScheme="red"
                                    onClick={e => confirmDelete(() => {
                                        if (schema)
                                            onDelete?.(schema)
                                    })}
                                >
                                    <Icon>
                                        <RXICO_TRASH />
                                    </Icon>
                                </IconButton>
                            </HStack>
                        </PageHeader>
                        <PageToolbar>
                            <HStack justifyContent="flex-end">
                                <Button colorScheme="red" onClick={e => confirmDelete(() => deleteAllAttributes())} >Delete All</Button>
                                <ActionButton onClick={attributeSelectionModal.onOpen} colorScheme="purple" >Add New Attribute</ActionButton>
                            </HStack>
                        </PageToolbar>
                        <PageBody>

                            <AttributeSelectionModal
                                {...attributeSelectionModal}
                                onChange={(f) => { onSelectAttribute(f?.attribute); setMode("new") }}
                            >
                            </AttributeSelectionModal>
                            <AttributeEditorModal
                                schema={schema}
                                errors={errors}
                                isOpen={newAttribute?.type?.length ? true : false}
                                attribute={newAttribute}
                                onClose={() => { setNewAttribute(undefined) }}
                                onSubmit={saveAttribute}
                                middlewares={[beforeSaveAttributeMiddleware]}
                            />
                            <Stack w="100%" spacing={4}>
                                <Heading pl={2} size="xs">
                                    Attributes
                                </Heading>
                                {schemaAttrs?.length ?
                                    <List w="100%" spacing={2}>
                                        {schemaAttrs.map((attr, ind) => {
                                            const rf = attributes_?.find(f => f.attribute.customType === attr.customType)
                                            const registeredAttribute: any = { ...rf, attribute: attr }
                                            return <ListItem w="100%"
                                                key={ind}
                                            >
                                                <Card w="100%" p={4}>
                                                    <HStack >
                                                        <Text flex={1}>
                                                            {attr.name}
                                                        </Text>
                                                        <HStack>
                                                            <IconButton onClick={() => {
                                                                setMode("edit")
                                                                onSelectAttribute(attr as any)
                                                            }} variant="ghost" aria-label="">
                                                                <Icon>
                                                                    <RXICO_EDIT />
                                                                </Icon>
                                                            </IconButton>
                                                            <IconButton onClick={() => {
                                                                confirmDelete(() => deleteAttribute(attr))
                                                            }} variant="ghost" aria-label="">
                                                                <Icon>
                                                                    <RXICO_TRASH />
                                                                </Icon>
                                                            </IconButton>
                                                        </HStack>
                                                    </HStack>
                                                </Card>
                                            </ListItem>
                                        })}
                                    </List>
                                    :
                                    <JumboAlert
                                        onClick={attributeSelectionModal.onOpen}
                                        variant="left-accent"
                                        cursor="pointer"
                                        status="info"
                                        title="No attributes found"
                                        description={<Text>
                                            Click here
                                            to add one now

                                        </Text>
                                        } />
                                }
                            </Stack>

                        </PageBody>
                        {changed ?
                            <PageFooter>
                                <ActionButton onClick={e => saveSchema()}>Save</ActionButton>
                            </PageFooter>
                            : ""}
                    </Page >
                    :
                    <Page>
                        <PageBody>
                            <Box>
                                Not Found
                            </Box>
                        </PageBody>
                    </Page>
            }
        </>
    )
}

export default EditorPage