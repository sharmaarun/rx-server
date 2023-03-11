import React, { useEffect, useState } from "react"
import { Box, Checkbox, FieldControl, FieldLabel, Heading, HStack, Stack, StackProps, Text, Tooltip } from "@reactive/ui"
import { useServerContext } from "@reactive/client"
import { APIRoute, toPascalCase } from "@reactive/commons"
import { ApiPermission } from "../../../commons"
import { apiPermissionsMatch } from "../../../commons/utils"

export interface APiPermissionInputProps extends Omit<StackProps, "defaultValue" | "onChange"> {
    children?: any
    defaultValue?: ApiPermission[]
    onChange?: (value: ApiPermission[]) => void
}

export type RenderableRoute = { title?: string, name: string, routes: APIRoute[] }
let tids: any = {
    toggle: 0
}
export function ApiPermissionInput({ children, defaultValue, onChange, ...props }: APiPermissionInputProps) {
    const { endpoints } = useServerContext()
    const [value, setValue] = useState<ApiPermission[]>([...(defaultValue || [])])

    useEffect(() => {
        onChange?.(value)
    }, [value])

    useEffect(() => {
        console.log(defaultValue, value)
        if (Array.isArray(defaultValue) && JSON.stringify(defaultValue) !== JSON.stringify(value)) {
            setValue([...(defaultValue || [])])
        }
    }, [defaultValue])

    const togglePermission = (permission: ApiPermission) => {
        if (!exists(permission)) {
            add(permission)
        } else {
            remove(permission)
        }
    }

    const add = (permission: ApiPermission) => {
        value.push(permission)
        setValue([...value])

    }
    const remove = (permission: ApiPermission) => {
        const value_ = value.filter(v => !apiPermissionsMatch(permission, v))
        setValue([...value_])
    }



    const exists = (permission: ApiPermission) => {
        return value.find(v => apiPermissionsMatch(permission, v))
    }

    const handleClick = (permission: ApiPermission) => (e: any) => {
        clearTimeout(tids.toggle)
        tids.toggle = setTimeout(() => {
            togglePermission(permission)
        }, 10)
    }

    return (
        <Stack {...props} spacing={4}>
            {endpoints?.
                filter(ep => ep.routes.length > 0)?.
                map?.((ep, index) =>
                    <Stack key={index} spacing={0}>
                        <HStack bg="gray.50" p={2} shadow="base">
                            <Heading size="sm">{ep.title ?? toPascalCase(ep?.name || ep?.schema?.name)}</Heading>
                        </HStack>
                        <HStack
                            p={4}
                            alignItems="flex-start"
                            border="1px solid"
                            borderColor="blackAlpha.100"
                            spacing={0} flexWrap="wrap">
                            {ep.routes?.map?.((r, rindex) => {
                                const perm = { name: ep.name, ...r }
                                return <FieldControl w="25%" py={2} >
                                    <HStack
                                        alignItems="flex-start"
                                        key={rindex}
                                        onChange={handleClick(perm)}
                                    >
                                        <Box pt={1}>
                                            <Checkbox isChecked={exists(perm) ? true : false} />
                                        </Box>
                                        <Tooltip label={perm.path}>
                                            <FieldLabel
                                                pr={4}
                                                wordBreak="break-all"
                                            >
                                                {r.handler}
                                            </FieldLabel>
                                        </Tooltip>
                                    </HStack>
                                </FieldControl>
                            }
                            )}
                        </HStack>
                    </Stack>)
            }
        </Stack >
    )
}

export default ApiPermissionInput