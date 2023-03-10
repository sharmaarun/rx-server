import { BaseAttributeType, EntitySchema, Operator, toPascalCase } from "@reactive/commons"
import { RXICO_PLUS, RXICO_TRASH } from "@reactive/icons"
import { ActionButton, Anchor, Box, Card, Field, FieldControl, FieldLabel, Form, FormProps, Heading, HStack, Icon, IconButton, Input, NumberInput, Select, SelectOption, Stack, StackProps, Tooltip, useFormContext, useFormModal } from "@reactive/ui"
import { plainToInstance } from "class-transformer"
import { IsNotEmpty, validate, ValidationError } from "class-validator"
import { ReactNode, useEffect, useState } from "react"

export type QueryFilterInputComponentOptions = {
    queryFilter?: QueryFilter,
    values?: QueryFilter[],
}

export type QueryFilter = {
    op: Operator
    title: string
    attributeTypes?: BaseAttributeType[],
    inputComponent?: ReactNode | ((opts?: QueryFilterInputComponentOptions) => ReactNode),
}

export type QueryOperatorsMapType = {
    [key in Operator]?: QueryFilter
}


export class FilterDTO {
    @IsNotEmpty({ message: "Required" })
    attributeName?: string

    @IsNotEmpty({ message: "Required" })
    key?: string

    @IsNotEmpty({ message: "Required" })
    value?: string
}

export const QueryOperatorsMap: QueryOperatorsMapType = {
    [Operator.eq]: {
        title: "Equals",
        op: Operator.eq,
        inputComponent: Input,
        attributeTypes: [
            BaseAttributeType.string,
            BaseAttributeType.number,
            BaseAttributeType.date,
            BaseAttributeType.boolean,
            BaseAttributeType.enum,
            BaseAttributeType.json,
            BaseAttributeType.relation,
            BaseAttributeType.uuid,
        ],
    },
    [Operator.gt]: {
        title: "Greate than",
        op: Operator.gt,
        inputComponent: NumberInput,
        attributeTypes: [
            BaseAttributeType.date,
            BaseAttributeType.number,
            BaseAttributeType.uuid,
        ],
    },
    [Operator.gte]: {
        title: "Greate than / Equal to",
        op: Operator.gte,
        inputComponent: NumberInput,
        attributeTypes: [
            BaseAttributeType.date,
            BaseAttributeType.number,
            BaseAttributeType.uuid,
        ],
    },
    [Operator.lt]: {
        title: "Less than",
        op: Operator.lt,
        inputComponent: NumberInput,
        attributeTypes: [
            BaseAttributeType.date,
            BaseAttributeType.number,
            BaseAttributeType.uuid,
        ],
    },
    [Operator.lte]: {
        title: "Less than / Equal to",
        op: Operator.lte,
        inputComponent: NumberInput,
        attributeTypes: [
            BaseAttributeType.date,
            BaseAttributeType.number,
            BaseAttributeType.uuid,
        ],
    },
    [Operator.between]: {
        title: "Is between",
        op: Operator.between,
        inputComponent: ({ value, onChange }: any) => <Input
            value={value?.join?.([","])}
            onChange={e => onChange?.(e?.target?.value?.split(","))} />,
        attributeTypes: [
            BaseAttributeType.date,
            BaseAttributeType.number,
            BaseAttributeType.uuid,
        ],
    },
    [Operator.in]: {
        title: "Is in",
        op: Operator.in,
        inputComponent: ({ value, onChange }: any) => <Input
            value={value?.join?.([","])}
            onChange={e => onChange?.(e?.target?.value?.split(","))} />,
        attributeTypes: [
            BaseAttributeType.date,
            BaseAttributeType.number,
            BaseAttributeType.uuid,
            BaseAttributeType.enum,
            BaseAttributeType.relation,
            BaseAttributeType.string,
        ],
    },
}

export interface EntityFiltersProps extends Omit<StackProps, "defaultValue" | "onChange"> {
    children?: any
    schema?: EntitySchema
    defaultValue?: FilterDTO[]
    onChange?: (filters: FilterDTO[]) => void
}

export const QueryFilterFormFields = ({ schema, ...props }: Omit<EntityFiltersProps & FormProps, "children">) => {
    const { value } = useFormContext()
    const attribute = Object.values(schema?.attributes || {}).find(attr => attr.name === value?.attributeName)
    const queryOperators = Object.values(QueryOperatorsMap).filter(qo => attribute?.type && qo?.attributeTypes?.includes(attribute?.type))
    const InputRenderer = (QueryOperatorsMap as any)?.[value?.key]?.inputComponent || Input;
    return <HStack alignItems="flex-start">
        <FieldControl flex={1}>
            <FieldLabel>Attribute</FieldLabel>
            <Field name="attributeName">
                <Select>
                    <SelectOption>--</SelectOption>
                    {Object.values(schema?.attributes || {}).map((attr, index) =>
                        <SelectOption key={index} value={attr.name}>
                            {toPascalCase(attr.name)}
                        </SelectOption>)}
                </Select>
            </Field>
        </FieldControl>

        <FieldControl flex={1}>
            <FieldLabel>Filter</FieldLabel>
            <Field name="key">
                <Select>
                    <SelectOption>--</SelectOption>
                    {queryOperators?.map((opr, index) =>
                        <SelectOption value={opr.op} key={index}>
                            {opr.title}
                        </SelectOption>)}
                </Select>
            </Field>
        </FieldControl>

        <FieldControl flex={1}>
            <FieldLabel>Value</FieldLabel>
            <Field name="value">
                {<InputRenderer />}
            </Field>
        </FieldControl>

    </HStack >
}


export function EntityFilters({ children, defaultValue, onChange, schema, ...props }: EntityFiltersProps) {
    const defaultFilter = {
        attributeName: Object.values(schema?.attributes || {})?.[0]?.name,
    }
    const [filters, setFilters] = useState<FilterDTO[]>(defaultValue || [])
    const [errors, setErrors] = useState<ValidationError[][]>([])

    useEffect(() => {
        if (JSON.stringify(defaultValue) !== JSON.stringify(filters)) {
            setFilters(defaultValue || [])
        }
    }, [defaultValue])

    const add = (filter: FilterDTO) => {
        filters.push(filter)
        setFilters([...filters])
    }

    const onChange_ = (index: number, update: any) => {
        filters[index] = { ...(filters[index] || {}), ...(update || {}) }
        setFilters([...filters])
    }

    const remove = (index: number) => {
        filters.splice(index, 1)
        if (filters.length <= 0) {
            return removeAll()
        }
        setFilters([])
    }

    const removeAll = () => {
        setFilters([])
        onChange?.([])
    }

    const handleSubmit = async (value?: any) => {
        // validate all forms
        const errors_ = []
        let hasErrors = false
        for (let filter of filters) {
            const inst = plainToInstance(FilterDTO, filter)
            const errs = await validate(inst)
            if (errs?.length) {
                errors_.push(errs)
                hasErrors = true
            } else {
                errors_.push([])
            }
        }
        if (hasErrors) {
            setErrors(errors_)
            return;
        }
        onChange?.(filters)
    }

    return (
        <>

            <Stack pb={4} {...props}>
                <HStack>
                    <Heading flex={1} size="xs">Filters</Heading>
                    {filters?.length &&
                        <Tooltip label="Remove All">
                            <IconButton onClick={e => removeAll()} aria-label="Remove All">
                                <Icon>
                                    <RXICO_TRASH />
                                </Icon>
                            </IconButton>
                        </Tooltip>
                    }
                    <Tooltip label="Add Filter">
                        <IconButton onClick={e => add(defaultFilter)} aria-label="Add Filter">
                            <Icon>
                                <RXICO_PLUS />
                            </Icon>
                        </IconButton>
                    </Tooltip>
                </HStack>
                <Stack spacing={2}>
                    {filters?.length ?
                        <Stack maxH={"300px"} overflowY="auto">{
                            filters?.map((filter, index) =>
                                <Card p={4} key={index} pos="relative">
                                    <IconButton
                                        aria-label="Remove"
                                        pos="absolute"
                                        top={0}
                                        right={0}
                                        variant="ghost"
                                        zIndex={2}
                                        onClick={e => remove(index)}
                                    >
                                        <Icon>
                                            <RXICO_TRASH />
                                        </Icon>
                                    </IconButton>
                                    <Form
                                        defaultValue={filter}
                                        updateOnDefaultValueChange={true}
                                        onSubmit={handleSubmit}
                                        onFormChange={value => onChange_(index, value)}
                                        errors={errors[index]}
                                    >
                                        <QueryFilterFormFields schema={schema} />
                                    </Form>
                                </Card>
                            )}
                        </Stack>
                        : ""}
                    {filters.length <= 0 ? <Card p={4}>
                        <Box>
                            No filters added. <Anchor onClick={e => add(defaultFilter)}>Click Here</Anchor> to add one now.
                        </Box>

                    </Card>
                        : <HStack >
                            <HStack flex={1}></HStack>
                            <HStack >
                                <ActionButton onClick={handleSubmit}>Apply</ActionButton>
                            </HStack>
                        </HStack>
                    }

                </Stack>
            </Stack>
        </>
    )
}
