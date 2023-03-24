import { confirmDelete, Obj, useClientContext, useServerUrl } from "@reactive/client"
import { File } from "@reactive/commons"
import { RXICO_CHECKMARK, RXICO_TRASH } from "@reactive/icons"
import { Box, Card, HStack, HStackProps, Icon, IconButton, Stack, Text, useEntityListViewerContext } from "@reactive/ui"
import { useEffect, useState } from "react"

export interface MediaListContainerProps extends Omit<HStackProps, "onChange"> {
    children?: any
    fileObj?: Obj<File>
    list?: () => void
    defaultValue?: any[]
    onChange?: (value?: any[]) => void
    mode?: "single" | "multiple"
    span?: "sm" | "md" | "lg"
}

const toMulti = (val: any, mode: any) => mode === "single" ? (val ? [val] : []) : (val ?? [])
const fromMulti = (val: any, mode: any) => mode === "single" ? (val?.[0] ?? null) : (val ?? [])

const spanMap = {
    "lg": {
        w: ["50%", "50%", "33.33%", "20%"],
        h: "64"
    },
    "md": {
        w: ["50%", "50%", "50%", "25%"],
        h: "48"
    },
    "sm": {
        w: ["50%", "50%", "50%", "33.33%"],
        h: "32"
    }
}

export function MediaListContainer({ children, span = "sm", mode = "multiple", defaultValue, onChange, fileObj, list, ...props }: MediaListContainerProps) {
    const { data } = useEntityListViewerContext()
    const { server } = useClientContext()
    const serverUrl = useServerUrl()
    const [selected, setSelected] = useState<any[]>(toMulti(defaultValue, mode) ?? [])
    const onRemove = (id: string) => {
        confirmDelete(async () => {
            const count = await fileObj.delete(id)
            list?.()
        })
    }

    useEffect(() => {
        onChange?.(fromMulti(selected, mode))
    }, [selected])

    useEffect(() => {
        if (JSON.stringify(defaultValue) !== JSON.stringify(selected)) {
            setSelected(toMulti(defaultValue, mode))
        }
    }, [defaultValue])
    const select = (id: string | number) => {
        selected.push(id)
        setSelected([...selected])
    }
    const deselect = (id: string | number) => {
        const selected_ = selected?.filter(_id => _id !== id) || []
        setSelected([...selected_])
    }
    const toggle = (id: string | number) => {
        const exists = selected?.find(_id => _id === id)
        if (exists) {
            deselect(id)
        } else {
            select(id)
        }
    }
    const selected_ = data?.filter(d => selected.includes(d.id))

    return (<>
        {children}
        <Stack>
            <HStack
                spacing={0}
                justifyContent={"flex-start"}
                flexWrap="wrap"
                {...props}
            >
                {data?.map((file: any, ind) =>
                    <Box
                        key={ind}
                        p={2}
                        w={["50%", "50%", "25%", "25%"]}
                    >
                        <Card
                            h="64"
                            onClick={e => toggle(file.id)}
                            outline="2px solid"
                            outlineColor={(onChange && selected?.includes(file.id)) ? "purple.500" : "transparent"}
                            bgColor="black"
                            p={4}
                            bgImg={`url(${serverUrl + file.url})`}
                            bgSize="cover"
                            bgRepeat="no-repeat"
                            transition="all 0.2s ease-in-out"
                            _hover={onChange ? { outlineColor: "purple.500" } : {}}
                            bgPos="center"
                            pos="relative"
                            role="group"
                        >
                            {onChange && selected?.includes(file.id) ? <HStack pos="absolute"
                                top={0}
                                left={0}
                                bottom={0}
                                right={0}
                                bg="blackAlpha.500"
                                borderRadius="5"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Icon w="8" h="8" borderRadius="full" bg="white"><RXICO_CHECKMARK /></Icon>
                            </HStack> : ""}
                            <HStack
                                bg="whiteAlpha.700"
                                pos="absolute"
                                right="0"
                                top="0"
                                display="none"
                                borderRadius={5}
                                _groupHover={{ display: "flex" }}
                            >
                                <IconButton variant="ghost" onClick={e => onRemove(file.id)} aria-label="Delete">
                                    <Icon>
                                        <RXICO_TRASH />
                                    </Icon>
                                </IconButton>
                            </HStack>
                        </Card>
                    </Box>
                )
                }

            </HStack >
        </Stack>
    </>
    )
}

export default MediaListContainer