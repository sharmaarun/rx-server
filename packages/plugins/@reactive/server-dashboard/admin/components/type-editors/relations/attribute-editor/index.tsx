import { AttributeEditorContext, DefaultAttributesValidationClass, useServerContext } from "@reactive/client"
import { Attribute, pluralize, RelationType, toPascalCase } from "@reactive/commons"
import { Field, FieldControl, FieldDescription, FieldLabel, FormContext, FormStage, HStack, Icon, Input, Select, SelectOption, SpreadSelect, SpreadSelectOption, SpreadSelectProps, Stack, Text, useFormContext } from "@reactive/ui"
import { IsNotEmpty } from "class-validator"
import { useEffect, useState } from "react"
import { RelationTypes } from "../../../../utils"
export interface RelationsAttributeEditorProps extends SpreadSelectProps, AttributeEditorContext {
    children?: any
}

export class RelationTypeValidationClass extends DefaultAttributesValidationClass {
    @IsNotEmpty({ message: "Should not be empty" })
    relationType!: RelationType

    @IsNotEmpty({ message: "Should not be empty" })
    ref!: string

}
const tid: any = {}
export function RelationsAttributeEditor({ children, attribute, schema, ...props }: RelationsAttributeEditorProps) {
    const { value, defaultValue, onChange, errors, addMiddleware } = useFormContext()
    const { endpoints } = useServerContext()
    const [middlewareAdded, setMiddlewareAdded] = useState(false)

    useEffect(() => {
        if (addMiddleware && !middlewareAdded) {
            addMiddleware?.((ctx) => {
                const ep = endpoints?.find(e => e.schema?.name === ctx.value.ref)
                const exists = Object.values(ep?.schema?.attributes || {}).find(a => a.name === ctx.value?.["foreignKey"])
                if (exists) {
                    const errors = [{ property: "foreignKey", constraints: { "exists": "Already exists!" } }]
                    console.error("Validation Error", errors)
                    return errors
                }
                return []
            })
            setMiddlewareAdded(true)
        }
    }, [addMiddleware])

    const foreignKeyExists = (name: string) => {

    }

    const generateForeignKeyName = (val: any) => {
        const foreignKey = (
            val?.relationType === RelationType.MANY_TO_ONE ||
            val?.relationType === RelationType.MANY_TO_MANY)
            ? pluralize(schema?.name || "")
            : schema?.name

        return foreignKey
    }

    const onSubmit = ({ foreignKey }: any) => {
        console.log(foreignKey)
        if (!foreignKey || foreignKey.length <= 0) {
            onChange?.("foreignKey", generateForeignKeyName(schema?.name))
        }
    }
    console.log(JSON.stringify(errors))
    return (
        <FormStage onSubmit={onSubmit} validationClass={RelationTypeValidationClass}>
            <HStack alignItems="flex-start">
                <Stack w="25%">
                    <FieldLabel>
                        Current Data Type
                    </FieldLabel>
                    <Input isDisabled value={schema?.name} />
                    <FieldLabel>
                        Attribute Name
                    </FieldLabel>
                    <Field name="name">
                        <Input
                            isDisabled={defaultValue?.name?.length}
                        />
                    </Field>
                </Stack>
                <FieldControl w="50%">
                    <FieldLabel textAlign="center">Choose type of relation...</FieldLabel>
                    <Field name="relationType" defaultValue={Object.keys(RelationTypes)?.[0]}>
                        <SpreadSelect  {...props}>
                            {Object.keys(RelationTypes).map((k, rind) => {
                                const r = (RelationTypes as any)[k]
                                return <SpreadSelectOption
                                    value={k}
                                    key={rind} p={4}
                                >
                                    <Icon>
                                        {r.icon || r.title}
                                    </Icon>
                                </SpreadSelectOption>
                            }

                            )}
                        </SpreadSelect>
                    </Field>
                    <FieldDescription textAlign="center">
                        <HStack
                            justifyContent="center"
                            alignItems="center"
                            flexDir={["column", "column", "row"]}
                        >
                            <Text fontWeight="bold">
                                {toPascalCase(schema?.name || "")}
                            </Text>
                            <Text color="purple.500">
                                {(RelationTypes as any)?.[value?.relationType]?.title}
                            </Text>
                            <Text fontWeight="bold">
                                {toPascalCase(value?.ref || "")}
                            </Text>
                        </HStack>
                    </FieldDescription>
                </FieldControl>
                <Stack w="25%">
                    <FieldLabel>
                        Related Data Type
                    </FieldLabel>
                    <Field name="ref" defaultValue={endpoints?.[0]?.schema?.name}>
                        <Select>
                            {endpoints?.filter(ep => Object.keys(ep.schema?.attributes || {})?.length).map((ep, ind) =>
                                <SelectOption key={ind} value={ep.schema?.name}>{ep.schema?.name}</SelectOption>
                            )}
                        </Select>
                    </Field>
                    <FieldLabel>
                        Attribute Name
                    </FieldLabel>
                    <Field name="foreignKey" display={value?.ref?.length ? "block" : "none"}>
                        <Input
                            // isDisabled={defaultValue?.foreignKey?.length}
                            placeholder={generateForeignKeyName(value)}
                        />
                    </Field>
                </Stack>
            </HStack>

        </FormStage>
    )
}

export default RelationsAttributeEditor