import "reflect-metadata"
//
import { AttributeEditorContext, DefaultAttributesValidationClass, useAttributes } from "@reactive/client"
import { BasicAttributeValidation, EntitySchema, Attribute, toPascalCase } from "@reactive/commons"
import { Box, Button, Card, Checkbox, Field, FieldControl, FieldDescription, FieldLabel, Form, FormBackButton, FormModal, FormModalProps, FormProps, FormStage, FormSubmitButton, HStack, Icon, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, SelectOption, Stack, StackProps, Text, Tooltip, useDisclosure, useFormModal } from "@reactive/ui"
import { IsNotEmpty } from "class-validator"
import { useState } from "react"
import { RXICO_EDIT, RXICO_PLUS, RXICO_TRASH } from "@reactive/icons"

export interface AttributeEditorModalProps extends Omit<FormModalProps, "children"> {
    attribute?: Attribute
    schema?: EntitySchema
    onSubmit?: (field: Attribute) => void
}

export class NameValidationDTO extends DefaultAttributesValidationClass {
}

export interface ArryOfInputProps extends Omit<FormProps, "defaultValue" | "onChange"> {
    value?: any[]
    defaultValue?: any[]
    onChange?: (value?: any[]) => void
    titleKey?: string
    renderer?: (value: any) => JSX.Element
}

export const ArryOfInput = ({ children, defaultValue = [], title, renderer, titleKey = "name", onChange, ...props }: ArryOfInputProps) => {
    const [value, setValue] = useState<any[]>(defaultValue)
    const [current, setCurrent] = useState<number>(-1)
    const [mode, setMode] = useState<"edit" | "add">("add")
    const disc = useFormModal({
        onSubmit(val) {
            if (current > -1) {
                setCurrent(-1)
                for (let ind = 0; ind < value.length; ind++) {
                    if (ind === current) {
                        value[ind] = { ...(value[ind] || {}), ...val }
                        onChange_(value)
                        return;
                    }
                }
            }
            value.push(val)
            onChange_(value)

        },
        defaultValue
    })

    const onChange_ = (value_: any[]) => {
        setValue([...value_])
        onChange?.([...value_])
    }

    const onAddClick = () => {
        setMode("add")
        setCurrent(-1)
        disc.onOpen()
    }

    const onEditClick = (ind: number) => {
        setCurrent(ind)
        setMode("edit")
        disc.onOpen()
    }

    const onRemoveAllClick = () => {
        onChange_([])
    }

    const onRemoveClick = (ind: number) => {
        value.splice(ind, 1)
        onChange_(value)
    }
    return (<>
        <FormModal {...disc} defaultValue={value[current]}>
            <ModalHeader>
                {toPascalCase(mode)} {title}
            </ModalHeader>
            <ModalBody>
                <Stack>
                    {children}
                </Stack>
            </ModalBody>
        </FormModal>
        <HStack justifyContent="flex-end">
            {value?.length &&
                <Tooltip title="Remove All">
                    <IconButton variant="ghost" onClick={() => onRemoveAllClick()} aria-label="">
                        <Icon>
                            <RXICO_TRASH />
                        </Icon>
                    </IconButton>
                </Tooltip>
            }
            <IconButton variant="ghost" aria-label="" onClick={onAddClick}>
                <Icon>
                    <RXICO_PLUS />
                </Icon>
            </IconButton>
        </HStack>
        <Stack>
            {value?.map((v, ind) =>
                <Card p={4} key={ind}>
                    <HStack>

                        {renderer ? <Box flex={1}>{renderer(v)}</Box> : <Text flex={1}>
                            {v?.[titleKey] || ind}
                        </Text>}
                        <HStack>
                            <IconButton variant="ghost" onClick={() => onEditClick(ind)} aria-label="">
                                <Icon>
                                    <RXICO_EDIT />
                                </Icon>
                            </IconButton>
                            <IconButton variant="ghost" onClick={() => onRemoveClick(ind)} aria-label="">
                                <Icon>
                                    <RXICO_TRASH />
                                </Icon>
                            </IconButton>
                        </HStack>
                    </HStack>
                </Card>)}
            {value?.length <= 0 ? <Card onClick={onAddClick} p={4}>
                No data, Click here to add
            </Card> : ""}
        </Stack>
    </>
    )
}

export function AttributeEditorModal({ attribute, onSubmit, schema, middlewares, errors, ...props }: AttributeEditorModalProps) {
    const { attributes } = useAttributes()
    const regAttr = attributes.find(rf => rf.attribute.customType === attribute?.customType)
    const CustomTypeEditor = regAttr?.metadata.components?.attributeEditor
    return (
        <Modal size="3xl" {...props} >
            <AttributeEditorContext.Provider value={{ attribute, schema }}>
                <ModalOverlay />
                <Form onSubmit={v => {
                    onSubmit?.(v as any)
                    props?.onClose?.()
                }
                }
                    errors={errors}
                    middlewares={middlewares}
                    defaultValue={attribute}
                >
                    <ModalContent>
                        <ModalHeader>
                            <ModalCloseButton />
                            {toPascalCase(regAttr?.attribute?.customType || "")}
                        </ModalHeader>
                        <ModalBody>
                            <Field hidden name="type" defaultValue={regAttr?.attribute.type}>
                                <Input value={regAttr?.attribute.type} />
                            </Field>
                            <Field hidden name="customType" defaultValue={regAttr?.attribute.type}>
                                <Input value={regAttr?.attribute.type} />
                            </Field>
                            {CustomTypeEditor ? <CustomTypeEditor attribute={attribute} schema={schema} /> :
                                <FormStage validationClass={NameValidationDTO}>
                                    <HStack alignItems="flex-start">

                                        <FieldControl flex={1}>
                                            <FieldLabel >
                                                Attribute Name
                                            </FieldLabel>
                                            <Field name="name">
                                                <Input isDisabled={attribute?.name?.length! >= 0} />
                                            </Field>

                                            <FieldDescription>
                                                Enter a unique name
                                            </FieldDescription>
                                        </FieldControl>
                                    </HStack>
                                </FormStage>
                            }
                            <FormStage>
                                <HStack pb={4} spacing={0} flexWrap="wrap">
                                    <FieldControl w={["100%", "100%", "50%"]}>
                                        <FieldLabel>
                                            Required
                                        </FieldLabel>
                                        <HStack>
                                            <Field name="isRequired" type="boolean">
                                                <Checkbox />
                                            </Field>
                                            <FieldDescription>
                                                Make it required in the database
                                            </FieldDescription>
                                        </HStack>
                                    </FieldControl>
                                    <FieldControl w={["100%", "100%", "50%"]}>
                                        <FieldLabel>
                                            Unique
                                        </FieldLabel>
                                        <HStack>
                                            <Field name="isUnique" type="boolean">
                                                <Checkbox />
                                            </Field>
                                            <FieldDescription>
                                                Make it unique field in the database
                                            </FieldDescription>
                                        </HStack>
                                    </FieldControl>
                                </HStack>
                                {/* <HStack pb={4} spacing={0} flexWrap="wrap">
                                    <FieldControl w={["100%", "100%", "50%"]}>
                                        <FieldLabel>
                                            Auto Increment
                                        </FieldLabel>
                                        <HStack>
                                            <Field name="autoIncrement" type="boolean">
                                                <Checkbox />
                                            </Field>
                                            <FieldDescription>
                                                Auto increment value for each new entry in the database (Integer Value)
                                            </FieldDescription>
                                        </HStack>
                                    </FieldControl>
                                </HStack> */}
                                <Stack>
                                    <FieldLabel>
                                        Validations
                                    </FieldLabel>
                                    <Field name="validations">
                                        <ArryOfInput title="Validation" renderer={v => <>{v.type}:{v.value}</>} titleKey="type">
                                            <FieldControl>
                                                <FieldLabel>
                                                    Validation Type
                                                </FieldLabel>
                                                <Field name="type">
                                                    <Select>
                                                        <SelectOption >{"--Select--"}</SelectOption>
                                                        {Object.keys(BasicAttributeValidation).map((v, ind) =>
                                                            <SelectOption key={ind} value={v}>{toPascalCase(v)}</SelectOption>
                                                        )}
                                                    </Select>
                                                </Field>
                                            </FieldControl>
                                            <FieldControl>
                                                <FieldLabel>
                                                    Value
                                                </FieldLabel>
                                                <Field name="value">
                                                    <Input />
                                                </Field>
                                            </FieldControl>
                                        </ArryOfInput>
                                    </Field>
                                </Stack>
                            </FormStage>
                        </ModalBody>
                        <ModalFooter justifyContent="flex-start">
                            <HStack w="full" flex={1}>
                                <HStack flex={1}>
                                    <Button onClick={props?.onClose}>Cancel</Button>
                                </HStack>
                                <HStack>
                                    <FormBackButton>Back</FormBackButton>
                                    <FormSubmitButton>Submit</FormSubmitButton>
                                </HStack>
                            </HStack>
                        </ModalFooter>
                    </ModalContent>
                </Form>
            </AttributeEditorContext.Provider>
        </Modal>
    )
}

export default AttributeEditorModal