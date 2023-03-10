import React, { useEffect, useState } from "react"
import { useAttributes, useServerContext } from "@reactive/client"
import { Attribute, BaseAttributeType, NumberAttributeSubType, toPascalCase } from "@reactive/commons"
import { Field, FieldControl, FieldLabel, Form, FormProps, HStack, Input, Stack, StackProps } from "../index"
import { ValidationError } from "class-validator"
import { createContext, useContext } from "react"

export type UseEntityEditorProps = {
    data?: any
    onChange?: (data: any) => void
    errors?: ValidationError[]
    entityName?: string
}
export type UseEntityEditorReturnType = ReturnType<typeof useEntityEditor>

export const useEntityEditor = ({
    data,
    entityName,
}: UseEntityEditorProps) => {

    const { endpoints } = useServerContext()
    const currentSchema = endpoints?.find(e => e?.schema?.name === entityName)?.schema
    const { attributes } = useAttributes()
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
    const sortBySpan = (a: Attribute, b: Attribute) => {
        const aspan = getRegisteredAttribute(a)?.metadata?.components?.valueEditor?.span ?? 0
        const bspan = getRegisteredAttribute(b)?.metadata?.components?.valueEditor?.span ?? 0
        return aspan - bspan
    }



    const defaultValue: any = {}
    for (let key in data || {}) {
        const attr = Object.values(currentSchema?.attributes || {})?.find(a => a.name === key)
        if (attr && attr.type === BaseAttributeType.relation && attr.name) {
            const ev = data?.[attr.name]
            defaultValue[attr.name] =
                Array.isArray(ev) ?
                    ev?.map(e => e?.id || e) :
                    (ev?.id || ev)
            continue;
        }
        defaultValue[attr?.name || key] = data?.[attr?.name || key]
    }

    return {
        defaultValue,
        getFieldType,
        sortBySpan,
        getRegisteredAttribute,
        currentSchema
    }
}

export const EntityEditorContext = createContext<UseEntityEditorReturnType>({} as any)
export const useEntityEditorContext = () => useContext(EntityEditorContext)


export interface EntityEditorProps extends UseEntityEditorProps, FormProps {
    children?: any
}

export function EntityEditor(props: EntityEditorProps) {
    const { children } = props || {}
    const ctx = useEntityEditor(props)
    const { defaultValue }: any = ctx || {}
    return <EntityEditorContext.Provider value={ctx}>
        <Form
            defaultValue={defaultValue}
            {...props}
        >
            {children}
        </Form>
    </EntityEditorContext.Provider>
}

export interface EntityEditorFieldsRendererProps {
    cildren?: any
}

export function EntityEditorFieldsRenderer(props: EntityEditorFieldsRendererProps) {
    const { defaultValue, currentSchema, getFieldType, getRegisteredAttribute, sortBySpan } = useEntityEditorContext()
    console.log(defaultValue)
    return (
        <HStack flexWrap="wrap" spacing={0} alignItems="flex-start" justifyContent="space-between">
            {Object.values((currentSchema?.attributes as any) || {})?.
                sort(sortBySpan as any).map((attr: any, ind) => {
                    const rattr = getRegisteredAttribute(attr)
                    const { valueEditor } = rattr?.metadata?.components || {}
                    const { component: ValueEditor = Input, span = 6 } = valueEditor || {}

                    return <FieldControl py={2} key={ind} w={["full", "full", (((span / 12) * 100) - 1) + "%"]}>
                        <FieldLabel>{toPascalCase(attr?.name)}</FieldLabel>
                        <Field name={attr?.name} type={getFieldType(attr)}>
                            <ValueEditor attribute={attr} schema={currentSchema as any} autoFocus={ind === 0} />
                        </Field>
                    </FieldControl>
                }
                )}
        </HStack>
    )
}
