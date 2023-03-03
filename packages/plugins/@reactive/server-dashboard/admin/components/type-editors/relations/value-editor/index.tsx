import React, { useEffect, useState } from "react"
import { Card, Input, InputGroup, LinkListItem, List, ListItem, Popover, PopoverBody, PopoverContent, PopoverTrigger, Select, SelectProps, Stack } from "@reactive/ui"
import { useEntityObj, ValueEditorContext } from "@reactive/client"
import { RelationType } from "@reactive/commons"
import { Op } from "sequelize"

export interface RelationValueEditorProps extends Omit<SelectProps, "defaultValue" | "onChange" | "value">, ValueEditorContext {
    children?: any
    value?: string | string[]
    defaultValue?: string | string[]
    onChange?: (value?: string | string[]) => void
}
const tids: any = {}


const singleRelationTypes = [
    RelationType.HAS_ONE,
    RelationType.MANY_TO_ONE,
    RelationType.ONE_TO_ONE,
]

const to = (val: string[], type: RelationType) => {
    return (singleRelationTypes.includes(type) && Array.isArray(val)) ? val?.[0] : val
}

const from = (val: string | string[] | any[], type: RelationType) => {
    return (singleRelationTypes.includes(type) && !Array.isArray(val)) ? [(val as any)?.id || val] : Array.isArray(val) ? val?.map(v => v?.id || v) : [(val as any)?.id]
}

export function RelationValueEditor({ children, attribute, onChange, defaultValue, ...props }: RelationValueEditorProps) {
    const { relationType = RelationType.HAS_ONE, ref = "", name } = attribute || {}
    const { obj, list, isLoading } = useEntityObj({ name: ref })
    const [search, setSearch] = useState("")
    const [data, setData] = useState<any[]>([])
    const [focused, setFocused] = useState(false)
    const [value, setValue] = useState(defaultValue ? from(defaultValue, relationType) : [])

    useEffect(() => {
        clearTimeout(tids.list)
        tids.list = setTimeout(async () => {
            const data_ = await obj.list({
                where: {
                    name: {
                        "like": "%" + search + "%"
                    }
                }
            })
            setData([...data_])
        }, 300)
    }, [search])

    useEffect(() => {
        onChange?.(to(value, relationType))
    }, [value])

    const add = (item: any) => {
        const exists = value?.find(v => v === item)
        !exists && setValue([...value, item])
    }

    const show = () => {
        setFocused(true)
    }

    const hide = () => {
        clearTimeout(tids.dropdown)
        tids.dropdown = setTimeout(() => {
            setFocused(false)
        }, 200)
    }

    return (
        <Stack>
            <InputGroup zIndex={2} pos="relative" onFocus={show} onBlur={hide}>
                <Input onChange={e => setSearch(e.target.value)} placeholder="Type to search..." />
                {focused && data?.length ?
                    <Card p={2} shadow="md" pos="absolute"
                        zIndex={2}
                        left={0}
                        right={0}
                        top={"100%"}
                        maxH="150px"
                        overflowY="auto"
                    >
                        <List>
                            {data?.map((d: any, ind: number) =>
                                <LinkListItem onClick={e => add(d?.id)} cursor="pointer" key={ind}>
                                    {d.name || d.id}
                                </LinkListItem>
                            )}
                        </List>
                    </Card>
                    : ""}

            </InputGroup>
            {value?.length ? <Card p={2} shadow="base"
                left={0}
                right={0}
                top={"100%"}
                maxH="150px"
                overflowY="auto"
            >
                <List>
                    {value?.map?.((d: any, ind: number) => {
                        const val = data?.find((dd) => dd.id === d)
                        return <ListItem cursor="pointer" key={ind}>
                            {val?.name || val?.id}
                        </ListItem>
                    })}
                </List>
            </Card>
                : ""
            }
        </Stack>
    )
}

export default RelationValueEditor