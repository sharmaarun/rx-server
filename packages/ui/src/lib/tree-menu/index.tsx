import { RXICO_CHEVRON_DOWN } from '@reactive/icons'
import { useState } from 'react'
import Box from '../box'
import { H6 } from '../headings'
import { Icon } from '../icon'
import Link from '../link'
import Stack, { HStack } from '../stack'
import { ListItem } from '../utils'

type Props = {
    items: ListItem[],
    onClick?: (item: ListItem, index?: number) => void,
    active?: string | number,
}

type TreeMenuItemProps = {
    item: ListItem,
    onClick?: (item: ListItem, index?: number) => void,
    active?: string | number,
    index: number,
    indent?: number,
    open?: number[]
    toggleOpen?: (index: number) => void
}


const TreeMenuItem = ({ item, active, onClick, open, toggleOpen, index, indent = 4 }: TreeMenuItemProps) => {

    return (
        <>{item.isDivider ? <H6 color="textdarkalpha" fontWeight="bold" p={4} pt={6} >
            {item.label}
        </H6> :
            <Stack
                transition="all 0.2s"
                _hover={{
                    color: active === item.id ? "brand.600" : "text",
                    backgroundColor: active === item.id ? "brand.200" : "brand.100",
                    borderLeftColor: active === item.id ? "brand.500" : "transparent"
                }}
                borderLeftColor={active === item.id ? "brand.500" : "transparent"}
                borderLeftStyle="solid"
                borderLeftWidth="3px"
                onClick={() => {
                    if (onClick) {
                        onClick(item, index)
                    } else {
                        item.onClick?.(item)
                    }
                }}
                color={active === item.id ? "brand.600" : "textalpha"}
                backgroundColor={active === item.id ? "brand.200" : "transparent"}
                fontWeight={active === item.id ? "bold" : "normal"}
                justifyContent="center"
            >
                <Link
                    px={4}
                    py={2}
                    flex={1}
                    _hover={{ textDecoration: "none" }}
                    color="textdark"
                    {...(item?.items?.length ? {
                        onClick: () => toggleOpen?.(index)
                    } : {
                        href: item.link || "#",

                    })}
                >
                    <HStack

                    >
                        <Icon>{item.icon}</Icon>
                        <Box pl={2} flex={1}>
                            {item.label}
                        </Box>
                        {item?.items && item?.items?.length > 0 ?
                            <Box pl={2}>
                                <Icon>
                                    <RXICO_CHEVRON_DOWN />
                                </Icon>
                            </Box> : ""}
                    </HStack>
                </Link>

            </Stack>
        }
            {
                item && item.items && item.items.length > 0 &&
                <Box pl={indent}>{
                    item.items?.map((item, index) => (
                        <TreeMenuItem
                            item={item}
                            onClick={item.onClick || onClick}
                            active={active}
                            index={index}
                            key={indent + "-" + item.id + "-" + index}
                            indent={indent + 2}
                        />)
                    )
                }
                </Box>
            }
        </>)
}

export function TreeMenu({
    items,
    onClick,
    active,
}: Props) {
    const [open, setOpen] = useState<number[]>([])
    const toggle = (index: number) => {
        if (open?.includes(index)) {
            setOpen(open.filter(v => v !== index))
        } else {
            setOpen([...open, index])
        }
    }
    return (
        <Stack spacing={0} justifyContent="stretch">
            {
                items.map((item, index) => {
                    return (
                        <TreeMenuItem
                            key={item.id + "-" + index}
                            item={item}
                            onClick={onClick}
                            active={active}
                            index={index}
                            open={open}
                            toggleOpen={toggle}
                        />
                    )
                })
            }
        </Stack>
    )
}
export default TreeMenu