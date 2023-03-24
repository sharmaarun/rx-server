import { Obj, parseQueryString, stringifyQuery } from "@reactive/client"
import { File, Query } from "@reactive/commons"
import { ActionButton, EntityListViewer, EntityListViewerAddNewButton, EntityListViewerBody, EntityListViewerDateRangeSelector, EntityListViewerDateRangeSelectorToggleButton, EntityListViewerFiltersEditor, EntityListViewerFiltersEditorToggleButton, EntityListViewerHeader, EntityListViewerPageSizeSelector, EntityListViewerPagination, EntityListViewerSortMenu, Heading, HStack, Page, PageBody, PageFooter, PageHeader, PageToolbar, Spinner, Stack, StackProps, useFormModal } from "@reactive/ui"
import UploadBox from "../../components/upload-box"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import MediaListContainer from "../../components/container"

export interface MediaListPageProps extends StackProps {
    children?: any
}
const tids: any = {
    search: 0
}
export function MediaListPage({ children, ...props }: MediaListPageProps) {
    const { search } = useLocation()
    const obj = new Obj<File>("file")
    const navigate = useNavigate()
    const [result, setResult] = useState<any>([])
    const [loading, setLoading] = useState(true)
    const uploadForm = useFormModal({
        onSubmit(value) {
            console.log(value)
        }
    })
    useEffect(() => {
        list()
    }, [search])

    const list = () => {
        clearTimeout(tids.search)
        tids.search = setTimeout(async () => {
            try {
                setLoading(true)
                const {
                    where = {},
                    pagination = { page: 1, pageSize: 15 },
                    order=[["createdAt","DESC"]]
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
            navigate(window.location.pathname + `?${query}`)
        }
    }
    return (
        <EntityListViewer
            entityName="file"
            onSearch={onSearch}
            data={result?.rows}
            count={result?.count}
            defaultPageSize={15}
        >
            <Page>
                <PageHeader>
                    <Heading size="md">
                        Media
                    </Heading>
                </PageHeader>
                <PageToolbar>
                    <EntityListViewerDateRangeSelectorToggleButton />
                    <EntityListViewerFiltersEditorToggleButton />
                    <EntityListViewerSortMenu />
                    <ActionButton onClick={uploadForm.onOpen}>Upload</ActionButton>
                </PageToolbar>
                <PageBody flex={1}>
                    <>
                        <UploadBox  {...uploadForm} onSubmit={(res) => {
                            list()
                            uploadForm?.onSubmit(res)
                        }} />
                        {loading ?
                            <HStack justifyContent="center">
                                <Spinner />
                            </HStack>
                            :
                            <MediaListContainer list={list} fileObj={obj}>
                                <EntityListViewerFiltersEditor />
                                <EntityListViewerDateRangeSelector />
                            </MediaListContainer>

                        }
                    </>
                </PageBody>
                <PageFooter>
                    {/* <EntityListViewerPageSizeSelector flex={1} /> */}
                    <EntityListViewerPagination />
                </PageFooter>
            </Page>

        </EntityListViewer>
    )
}

export default MediaListPage