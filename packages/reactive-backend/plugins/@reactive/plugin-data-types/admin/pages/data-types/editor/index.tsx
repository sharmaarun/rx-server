import { RegisteredField, useFields } from "@reactive/client"
import { Endpoint, Field, toPascalCase } from "@reactive/commons"
import { RXICO_EDIT, RXICO_TRASH } from "@reactive/icons"
import { ActionButton, Box, Card, DeleteAlertModal, FormContext, Heading, HStack, Icon, IconButton, JumboAlert, List, ListItem, Page, PageBody, PageFooter, PageHeader, PageToolbar, StackProps, Text, useDisclosure } from "@reactive/ui"
import { ValidationError } from "class-validator"
import { useEffect, useState } from "react"
import { useOutletContext, useParams } from "react-router-dom"
import { EndpointEditorOutletContext } from ".."
import { FieldEditorModal } from "../../../components/field-editor-modal"
import { FieldSelectionModal } from "../../../components/field-selection-modal"
export interface EditorPageProps extends StackProps {
    children?: any
}


export function EditorPage({ children, ...props }: EditorPageProps) {
    const { name } = useParams() || {}
    const { fields } = useFields()
    const { endpoints = [], newEndpoint } = useOutletContext<EndpointEditorOutletContext>() || {}
    const fieldSelectionModal = useDisclosure()
    const deleteModal = useDisclosure()

    const [errors, setErrors] = useState<ValidationError[]>([])
    const [toDelete, setToDelete] = useState<Field>()
    const [newField, setNewField] = useState<RegisteredField>()
    const [endpoint, setEndpoint] = useState<Endpoint>()

    useEffect(() => {
        const ep = getEndpoint(name)
        if (ep) {
            setEndpoint(JSON.parse(JSON.stringify({ ...ep })))
        }
    }, [name, endpoints, newEndpoint])
    const { schema, name: epName } = endpoint || {}
    const endpointAttrs = schema?.columns?.filter?.(c => c?.name?.length)
    // const endpointAttrs = Object.keys(schema?.columns || {}).filter(name => schema?.columns?.[name]).map(name => ({ ...(schema?.columns?.[name] || {}) }))
    const [mode, setMode] = useState<"edit" | "new">("new")

    const getEndpoint = (name?: string) => [...endpoints, ...(newEndpoint ? [newEndpoint] : [])]?.find?.((ep: any) => ep?.name === name)

    const onSelectField = (field: RegisteredField) => {
        setNewField(field)
        setErrors([])
        fieldSelectionModal.onClose()
    }

    const saveField = (field: Field) => {
        if (endpoint && schema && field.name) {
            schema.columns = schema.columns || []
            const exists = schema?.columns?.find(c => c.name === field.name)
            if (mode === "edit" && !exists) throw new Error("Can't edit a field that doesn't exist!")
            if (exists) {
                Object.assign(exists, field)
            } else {
                schema.columns.push(field)
            }
            setEndpoint({ ...endpoint })
        }
    }

    const removeField = (field: Field) => {
        if (endpoint && schema?.columns) {
            schema.columns = schema.columns.filter(c => c.name !== field.name)
            setEndpoint({ ...endpoint })
        }
    }

    const beforeSaveFieldMiddleware = ({ value }: FormContext) => {
        if (endpoint && schema && schema.columns && value.name) {
            setErrors([])
            const exists = schema.columns.find(c => c.name === value.name)
            if (mode === "new" && exists) {
                setErrors([{
                    property: "name",
                    constraints: { "exists": "Already exists" }
                }])
                throw new Error("Field already exists")
            }
        }

    }

    const fields_ = [...fields]
    const endpoint_ = getEndpoint(name)
    const changed = endpoint_ && endpoint && JSON.stringify(endpoint) !== JSON.stringify(endpoint_)

    return (
        <>
            {
                epName ?
                    <Page>
                        <PageHeader>
                            <Heading size="md">
                                {toPascalCase(epName || "")} Attributes
                            </Heading>
                        </PageHeader>
                        <PageToolbar>
                            <HStack justifyContent="flex-end">
                                <ActionButton onClick={fieldSelectionModal.onOpen} colorScheme="purple" >Add New Attribute</ActionButton>
                            </HStack>
                        </PageToolbar>
                        <PageBody>
                            <DeleteAlertModal onSubmit={() => {
                                if (toDelete) {
                                    removeField(toDelete)
                                }
                                deleteModal.onClose()
                            }} {...deleteModal} />
                            <FieldSelectionModal
                                {...fieldSelectionModal}
                                onChange={(f) => { onSelectField(f); setMode("new") }}
                            >
                            </FieldSelectionModal>
                            <FieldEditorModal
                                errors={errors}
                                isOpen={newField?.field?.type?.length ? true : false}
                                field={newField}
                                onClose={() => { setNewField(null) }}
                                onSubmit={saveField}
                                middlewares={[beforeSaveFieldMiddleware]}
                            />
                            <Box w="100%">
                                {endpointAttrs?.length ?
                                    <List w="100%" spacing={2}>
                                        {endpointAttrs.map((attr, ind) => {
                                            const rf = fields_?.find(f => f.field.customType === attr.customType)
                                            const registeredField: any = { ...rf, field: attr }
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
                                                                onSelectField(registeredField)
                                                            }} variant="ghost" aria-label="">
                                                                <Icon>
                                                                    <RXICO_EDIT />
                                                                </Icon>
                                                            </IconButton>
                                                            <IconButton onClick={() => {
                                                                setToDelete(attr as any)
                                                                deleteModal.onOpen()
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
                                        onClick={fieldSelectionModal.onOpen}
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
                            </Box>

                        </PageBody>
                        {changed ?
                            <PageFooter>
                                <ActionButton onClick={e => console.log(endpoint)}>Save</ActionButton>
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