import React from "react"
import { PluginEndpoint } from "@reactive/client"
import { Box, HStack, List, ListItem, Stack, StackProps } from "@reactive/ui"
import { useEffect, useState } from "react"

export interface ListEndpointsProps extends StackProps {
    children?: any
}

export function ListEndpoints({ children, ...props }: ListEndpointsProps) {
    const [endpoint] = useState(new PluginEndpoint("data-types"))
    const [eps, setEps] = useState<any>([])
    useEffect(() => {
        endpoint.get().then(d => setEps(JSON.parse(d.data)))
    }, [])

    return (
        <Stack {...props}>
            <HStack>
                {eps?.length && <List minW="200px">
                    {
                        eps?.map((ep, ind) =>
                            <ListItem p={2} key={ind}
                                _hover={{ bgColor: "gray.100" }}
                                borderRadius={4}
                            >
                                {ep.name}
                            </ListItem>)
                    }
                </List>
                }
                <Box flex={1} />
            </HStack>
        </Stack>
    )
}

export default ListEndpoints