import { pluralize, toPascalCase } from "@reactive/commons"
import { RXICO_EDIT, RXICO_PLUS, RXICO_TRASH } from "@reactive/icons"
import React, { useState } from "react"
import Box from "../box"
import Card from "../card"
import { FormProps } from "../form"
import FormModal, { useFormModal } from "../form-modal"
import Icon, { IconButton } from "../icon"
import { ActionListItem, List } from "../list"
import { ModalBody, ModalHeader } from "../modal"
import Stack, { HStack } from "../stack"
import Text from "../text"
import Tooltip from "../tooltip"

export interface ArrayOfInputProps extends Omit<FormProps, "defaultValue" | "onChange"> {
    /**
     * Provide singular form
     */
    title: string,
    /**
     * fixed values
     */
    value?: any[]
    defaultValue?: any[]
    onChange?: (value?: any[]) => void
    /**
     * Indicates which object key to use as title key
     */
    titleKey?: string
    /**
     * Custom list item renderer
     * @param value 
     * @returns 
     */
    renderer?: (value: any) => JSX.Element
}

export const ArrayOfInput = ({ children,
    defaultValue = [],
    renderer,
    title,
    titleKey = "name",
    onChange, ...props }: ArrayOfInputProps) => {
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
        <FormModal {...disc} defaultValue={value[current]} {...props}>
            <ModalHeader>
                {toPascalCase(mode)} {title}
            </ModalHeader>
            <ModalBody>
                <Stack>
                    {children}
                </Stack>
            </ModalBody>
        </FormModal>
        <Stack>
            <HStack justifyContent="flex-end">
                {title?.length && <HStack flex={1}>
                    <Text fontWeight="semibold">
                        {pluralize(title)}
                    </Text>
                </HStack>
                }
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
            </HStack>
            <List>
                <Stack>
                    {value?.map((v, ind) =>
                        <ActionListItem
                            p={4}
                            py={2}
                            key={ind}
                        >
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
                        </ActionListItem>)}
                    {value?.length <= 0 ?
                        <ActionListItem
                            onClick={onAddClick} p={4}>
                            {title ? `No ${pluralize(title)}` : "Empty list"}, Click here to add {title ?? "item(s)"}
                        </ActionListItem> : ""}
                </Stack>
            </List>
        </Stack>
    </>
    )
}