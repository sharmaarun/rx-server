import { Obj, parseQueryString, stringifyQuery, useServerUrl, ValueEditorContext } from "@reactive/client"
import { File, Query } from "@reactive/commons"
import { RXICO_CHEVRON_LEFT, RXICO_CHEVRON_RIGHT, RXICO_EDIT } from "@reactive/icons"
import { Anchor, Box, EntityListViewer, Field, FormModal, FormModalProps, Heading, HStack, Icon, IconButton, ModalBody, ModalCloseButton, ModalHeader, Stack, Text, useFormModal } from "@reactive/ui"
import { useEffect, useState } from "react"
import MediaListContainer from "../container"
import { MediaSelectorListContainer } from "./container"

export type MediaAttributeValueEditorProps = ValueEditorContext & {
    defaultValue?: any
    onChange?: (value: any) => void
}

const ArrowButton = ({ children, onClick }: any) => {
    return <Stack
        justifyContent="center"
        alignItems="center"
        onClick={onClick}
        cursor="pointer"
    >{children}</Stack>
}

export function MediaAttributeValueEditor({ onChange, defaultValue, ...props }: MediaAttributeValueEditorProps) {
    const obj = new Obj<File>("file")
    const serverUrl = useServerUrl()
    defaultValue = (defaultValue ?? []).map(v => v?.id ?? v)
    const formModal = useFormModal({
        defaultValue
    })
    const [val, setVal] = useState<string[]>([])
    const [files, setFiles] = useState<File[]>([])
    const [active, setActive] = useState(0)
    useEffect(() => {
        if (JSON.stringify(defaultValue) !== JSON.stringify(val)) {
            setVal(defaultValue)
            fetch()
        }
    }, [defaultValue])

    const fetch = async () => {
        if (defaultValue?.length <= 0) return;
        try {
            const res = await obj.list({
                where: { id: { "in": defaultValue } },
                attributes: ["id", "url"]
            })
            setFiles(res)
        } catch (e) {
            console.error(e)
        }
    }

    const next = () => {
        setActive(active >= (files?.length - 1) ? 0 : (active + 1))
    }
    const prev = () => {
        setActive(active <= 0 ? (files.length - 1) : active - 1)
    }

    return (
        <Stack {...props}>
            <MediaSelectorModal  {...formModal} defaultValue={defaultValue} onSubmit={(data: any) => {
                onChange?.(data?.media)
                formModal.onClose()
            }}>
                <MediaListContainer />
            </MediaSelectorModal>
            <HStack
                border="1px solid"
                borderColor="gray.200"
                p={2}
                borderRadius={5}
                transition=".2s all"
                alignItems="stretch"
                pos="relative"
                _hover={{ borderColor: "gray.300" }}
                minH="64"
                overflow="hidden"
                role="group"
                spacing={0}
            >
                <HStack
                    display="none"
                    _groupHover={{ display: "flex" }}
                    pos="absolute"
                    zIndex={2}
                    top={0}
                    left={0}
                    right={0}
                    justifyContent="flex-end"
                    bg="whiteAlpha.800"
                    shadow="base"
                >
                    <HStack >
                        <IconButton onClick={formModal.onOpen} variant="ghost" aria-label="">
                            <Icon>
                                <RXICO_EDIT />
                            </Icon>
                        </IconButton>
                    </HStack>
                </HStack>
                <ArrowButton onClick={prev}>
                    <Icon><RXICO_CHEVRON_LEFT /></Icon>
                </ArrowButton>
                {files?.length > 0 ? <>
                    {
                        files?.map((f, ind) => <Box
                            flex={1}
                            key={ind}
                            display={active === ind ? "block" : "none"}
                            bgImg={`url(${serverUrl + f.url})`}
                            bgSize="cover"
                            bgPos="center"
                            w="64"
                            h="64"
                        />)
                    }</>
                    :
                    <HStack
                        flex={1}
                        bgSize="cover"
                        bgPos="center"
                        w="64"
                        h="64"
                    >
                        <Text>No media, <Anchor onClick={formModal.onOpen}>Click here</Anchor> to select</Text>
                    </HStack>
                }

                <ArrowButton onClick={next}>
                    <Icon><RXICO_CHEVRON_RIGHT /></Icon>
                </ArrowButton>
                {files.length > 0 &&
                    <HStack
                        display="none"
                        _groupHover={{ display: "flex" }}
                        pos="absolute" zIndex={2}
                        bottom={0}
                        left={0}
                        right={0}
                        justifyContent="center"
                        shadow="base"
                        bg="whiteAlpha.700"
                    >
                        <Text>
                            {active + 1}/{files?.length}
                        </Text>
                    </HStack>
                }
            </HStack >
        </Stack >
    )
}

export interface MediaSelectorModalProps extends FormModalProps {
}
const tids: any = {
    search: 0
}
export function MediaSelectorModal({ children, ...props }: MediaSelectorModalProps) {

    const obj = new Obj<File>("file")
    const [result, setResult] = useState<any>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    useEffect(() => {
        if (search?.length > 0) {
            list()
        }
    }, [search])

    const list = () => {
        clearTimeout(tids.search)
        tids.search = setTimeout(async () => {
            try {
                setLoading(true)
                const {
                    where = {},
                    pagination = { page: 1, pageSize: 15 },
                    order = [["createdAt", "DESC"]]
                }: Query = parseQueryString(search)
                const res = await obj?.listWithCount({
                    where,
                    pagination,
                    order
                })
                setResult(res)
            } catch (e) {
                setLoading(false)
            } finally {
                setLoading(false)
            }

        }, 200)
    }

    const onSearch = (queryObj: Query) => {
        const query = stringifyQuery(queryObj)
        if (typeof window !== "undefined") {
            setSearch("?" + query)
        }
    }
    return (
        <FormModal size="3xl" {...props} updateOnDefaultValueChange={true}>
            <ModalHeader>
                <ModalCloseButton />
                <Heading size="md">
                    Select Media
                </Heading>
            </ModalHeader>
            <ModalBody>
                <EntityListViewer
                    entityName="file"
                    onSearch={onSearch}
                    data={result?.rows}
                    count={result?.count}
                    defaultPageSize={15}
                >
                    <Field name="media" defaultValue={props.defaultValue}>
                        <MediaSelectorListContainer/>
                    </Field>
                </EntityListViewer>
            </ModalBody>
        </FormModal>
    )
}




