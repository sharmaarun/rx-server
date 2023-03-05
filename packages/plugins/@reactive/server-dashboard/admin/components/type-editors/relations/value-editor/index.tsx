import { getFirstAttributeByType, useEntityObj, useServerContext, ValueEditorContext } from "@reactive/client"
import { EntitySchema, RelationType } from "@reactive/commons"
import { RXICO_TRASH } from "@reactive/icons"
import { Button, Card, HStack, Icon, IconButton, Input, InputGroup, LinkListItem, List, ListItem, SelectProps, Stack, Text } from "@reactive/ui"
import { useEffect, useState } from "react"

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
    const [existingList, setExistingList] = useState<any[]>([])
    const [focused, setFocused] = useState(false)
    const [value, setValue] = useState<string[]>([])

    const { endpoints } = useServerContext()

    useEffect(() => {
        clearTimeout(tids.list)
        if (search?.length <= 0) return;
        tids.list = setTimeout(async () => {
            const data_ = await obj.list({
                where: {
                    [getKeyName()]: {
                        "like": "%" + search + "%"
                    }
                },
                attributes: ["id", getKeyName()]
            })
            setData([...data_])
        }, 300)
    }, [search])

    useEffect(() => {
        if (!defaultValue) return;
        const defaultValue_ = from(defaultValue, relationType)
        if (defaultValue_.length <= 0) return;
        if (JSON.stringify(defaultValue_) === JSON.stringify(value)) return;
        setValue(defaultValue_)
        clearTimeout(tids.list2)
        tids.list2 = setTimeout(async () => {
            await fetchExisting(defaultValue_)
        }, 300)
    }, [defaultValue])

    useEffect(() => {
        onChange?.(to(value, relationType))
    }, [value])

    const fetchExisting = async (ids: string[] | number[]) => {
        const data_ = await obj.list({
            where: {
                id: {
                    "in": ids
                }
            },
            attributes: ["id", getKeyName()]
        })
        setExistingList([...data_])
    }

    const getKeyName = () => {
        const refSchema: EntitySchema = endpoints?.find(ep => ep.schema?.name === attribute?.ref)?.schema as any
        let firstStringAttrKey: string = "id"
        if (refSchema && refSchema.name && refSchema.attributes) {
            firstStringAttrKey = getFirstAttributeByType(refSchema)?.name || firstStringAttrKey
        }
        return firstStringAttrKey
    }

    const add = (item: any) => {
        const exists = value?.find(v => v === item)
        !exists && setValue([...value, item])
    }

    const remove = (index: number) => {
        setValue([...(value?.filter((_, i) => i !== index) || [])])
    }

    const removeAll = () => {
        setValue([])
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
                                    {d[getKeyName()] || d.id}
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

            >
                <List
                    maxH="150px"
                    overflowY="auto">
                    {value?.map?.((d: any, ind: number) => {
                        const val = existingList?.find((dd) => dd.id === d)
                        return <ListItem alignItems="center" cursor="pointer" key={ind}>
                            <Text flex={1}>
                                {val?.[getKeyName()] || val?.id}
                            </Text>
                            <IconButton onClick={() => remove(ind)} variant="ghost" aria-label="">
                                <Icon>
                                    <RXICO_TRASH />
                                </Icon>
                            </IconButton>
                        </ListItem>
                    })}
                </List>
                <HStack pt={4} >
                    <Button flex={1} onClick={() => removeAll()} p={1} variant="outline" justifyContent="center">
                        Clear All
                    </Button>
                </HStack>

            </Card>
                : ""
            }
        </Stack>
    )
}

export default RelationValueEditor