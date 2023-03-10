import { EntitySchema, QueryOrderItem, QueryOrderItemDirection, toPascalCase } from "@reactive/commons"
import { RXICO_CHEVRON_DOWN, RXICO_CHEVRON_UP, RXICO_SORT } from "@reactive/icons"
import { ActionListItem, Box, Heading, HStack, Icon, IconButton, List, Menu, MenuButton, MenuItem, MenuItemOption, MenuList, MenuOptionGroup, MenuProps, Popover, PopoverContent, PopoverTrigger, Text, Tooltip } from "@reactive/ui"
import { forwardRef, useEffect, useState } from "react"

export interface SortMenuProps extends Omit<MenuProps, "children"> {
    children?: any
    schema?: EntitySchema
    label?: string
    onChange?: (orderItem: QueryOrderItem) => void
    value?: QueryOrderItem
    defaultValue?: QueryOrderItem
}



export const SortMenu = forwardRef(({ children, schema, onChange, value, defaultValue, label, ...props }: SortMenuProps, ref: any) => {
    const { name } = schema || {}
    const attributes = Object.values(schema?.attributes || {})
    const [sortList, setSortList]: [QueryOrderItem[], any] = useState([])
    useEffect(() => {
        // if (!sortList || sortList.length <= 0) {
        const sortList_ = []
        for (let attr of (attributes || [])) {
            sortList_.push([attr.name, "DESC"])
            sortList_.push([attr.name, "ASC"])
        }
        if (JSON.stringify(sortList) !== JSON.stringify(sortList_)) {
            setSortList([...sortList_])
        }
        // }
    }, [attributes])

    const onChange_ = (val: any) => {
        onChange?.(val)
    }
    return (
        <Box>
            <Popover  {...props} >
                <PopoverTrigger >
                    <IconButton aria-label="">
                        <Tooltip label={label || "Sort"}>
                            <Icon>
                                <RXICO_SORT />
                            </Icon>
                        </Tooltip>
                    </IconButton>
                </PopoverTrigger>
                <PopoverContent>
                    <List maxH="300px" overflowY="auto" shadow="base" borderRadius={5}>
                        {sortList?.map((item, index) =>
                            <ActionListItem
                                p={2}
                                borderRadius={0}
                                isActive={JSON.stringify(value ? value : defaultValue) === JSON.stringify(item)}
                                key={index}
                                onClick={e => onChange_(item)} >
                                <HStack w="100%" flex={1}>
                                    <Text flex={1}>
                                        {toPascalCase(item[0])}
                                    </Text>
                                    <Icon>
                                        {item[1] === "DESC" || item[1] === "desc" ?
                                            <RXICO_CHEVRON_DOWN /> :
                                            <RXICO_CHEVRON_UP />}
                                    </Icon>
                                </HStack>
                            </ActionListItem>
                        )}
                    </List>
                </PopoverContent>
            </Popover >
        </Box >
    )
})

export default SortMenu