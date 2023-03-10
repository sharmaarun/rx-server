import { Page, PageBody, PageFooter, PageHeader, PageToolbar } from "../page"
import {
    EntityListViewer,
    EntityListViewerFiltersEditor,
    EntityListViewerDateRangeSelector,
    EntityListViewerPageSizeSelector,
    EntityListViewerPageSizeSelectorProps,
    EntityListViewerPagination,
    EntityListViewerPaginationProps,
    EntityListViewerSortMenu,
    EntityListViewerFiltersEditorToggleButton,
    EntityListViewerDateRangeSelectorToggleButton,
    EntityListViewerHeader,
    EntityListViewerToolbar,
    EntityListViewerBody
} from "./index"
export default {
    title: "Entity List Viewer",
    component: EntityListViewer
}

export const PageSizeSelector =
    (props: EntityListViewerPageSizeSelectorProps) =>
        <EntityListViewerPageSizeSelector {...props} />

export const Pagination =
    (props: EntityListViewerPaginationProps) =>
        <EntityListViewerPagination {...props} />

export const Filters =
    (props: any) =>
        <EntityListViewerFiltersEditor {...props} />

export const SortMenu =
    (props: any) =>
        <EntityListViewerSortMenu {...props} />

export const DateRangeSelector =
    (props: any) =>
        <EntityListViewerDateRangeSelector {...props} />

export const FiltersToggle =
    (props: any) =>
        <EntityListViewerFiltersEditorToggleButton {...props} />

export const DateRangeToggle =
    (props: any) =>
        <EntityListViewerDateRangeSelectorToggleButton {...props} />

export const ListViewer =
    (props: any) =>
        <EntityListViewer {...props} >
            <Page minH={"100vh"}>
                <PageHeader>
                    <EntityListViewerHeader title="Listing" />
                </PageHeader>
                <PageToolbar>
                    <EntityListViewerToolbar >
                        <EntityListViewerDateRangeSelectorToggleButton />
                        <EntityListViewerFiltersEditorToggleButton />
                        <EntityListViewerSortMenu />
                    </EntityListViewerToolbar>
                </PageToolbar>
                <PageBody flex={1}>
                    <EntityListViewerBody>
                        <EntityListViewerFiltersEditor />
                        <EntityListViewerDateRangeSelector />
                    </EntityListViewerBody>
                </PageBody>
                <PageFooter>
                    <EntityListViewerPageSizeSelector />
                    <EntityListViewerPagination />
                </PageFooter>
            </Page>
        </EntityListViewer>