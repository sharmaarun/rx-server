import { RXICO_CHEVRON_LEFT, RXICO_PLUS, RXICO_SEARCH } from "@reactive/icons"
import React, { createContext, useContext, useState } from "react"
import Box from "../box"
import { Icon, IconButton, IconButtonProps } from "../icon"
import { Input, InputGroup, InputRightElement } from "../input"
import { HStack, Stack, StackProps } from "../stack"
export interface PageProps extends StackProps {
    children?: any
}
export type PageContext = {
    search?: string
    searchEnabled?: boolean
    setSearch?: (value: string) => void
    setSearchEnabled?: (value: boolean) => void
}
export const PageContext = createContext<PageProps & PageContext>({})

export function Page({ children, ...props }: PageProps & PageContext) {
    let header, toolbar, footer, body, content;

    const [ctx, setCtx] = useState<PageProps & PageContext>({ ...(props || {}) })

    React.Children.forEach(children, ele => {
        if (ele?.type?.name === PageHeader.name) {
            header = ele
        }
        if (ele?.type?.name === PageToolbar.name) {
            toolbar = ele
        }
        if (ele?.type?.name === PageBody.name) {
            body = ele
        }
        if (ele?.type?.name === PageFooter.name) {
            footer = ele
        }
        if (ele?.type?.name === PageContent.name) {
            content = ele
        }
    })

    const onCtxChange = (key: keyof PageContext, value: any) => {
        setCtx({ ...ctx, [key]: value })
    }

    const setSearchEnabled = (value: boolean) => onCtxChange("searchEnabled", value)
    const setSearch = (value: string) => onCtxChange("search", value)


    return (
        <PageContext.Provider value={{
            ...ctx,
            setSearch,
            setSearchEnabled
        }}>

            {(header || toolbar) &&
                <HStack px={4} minH="14">
                    {ctx.searchEnabled ?
                        <Box flex={1}>
                            <InputGroup onKeyUp={e => e.key === "Esc" && setSearchEnabled(false)}>
                                <Input autoFocus onChange={e => setSearch(e.target.value)} placeholder="Search" />
                                <InputRightElement onClick={e => setSearchEnabled(false)} >
                                    <IconButton aria-label="">
                                        <Icon transform="rotate(45deg)">
                                            <RXICO_PLUS />
                                        </Icon>
                                    </IconButton>
                                </InputRightElement>
                            </InputGroup>
                        </Box>
                        :
                        <>
                            {header}
                            {toolbar}
                        </>
                    }

                </HStack>
            }
            {content ?? <>
                {body}
                {footer}
            </>}
        </PageContext.Provider >
    )
}
export interface PageHeaderProps extends StackProps {
    children?: any
}

export function PageHeader({ children, ...props }: PageHeaderProps) {
    return (<Stack minH="14" justifyContent="center" {...props}>
        {children}
    </Stack>
    )
}

export interface PageBackButtonProps extends Omit<IconButtonProps, "aria-label"> {
    children?: any
}

export function PageBackButton({ children, ...props }: PageBackButtonProps) {
    const goBack = () => {
        if (typeof window !== 'undefined') {
            window.history.back()
        }
    }
    return (<IconButton onClick={goBack} {...props} aria-label="">
        <Icon>
            <RXICO_CHEVRON_LEFT />
        </Icon>
    </IconButton>
    )
}


export interface PageSearchProviderProps extends StackProps {
    children?: any
}

export function PageSearchProvider({ children, ...props }: PageSearchProviderProps) {
    return (
        <></>
    )
}

export interface PageContentProps extends StackProps {
    children?: any
}

export function PageContent({ children, ...props }: PageContentProps) {
    let body, footer;
    React.Children.forEach(children, ele => {
        if (ele?.type?.name === PageBody.name) {
            body = ele
        }
        if (ele?.type?.name === PageFooter.name) {
            footer = ele
        }
    })
    return (
        <Stack overflowY="hidden" flex={1} {...props}>
            {body}
            {footer}
        </Stack>
    )
}

export interface PageFooterProps extends StackProps {
    children?: any
}

export function PageFooter({ children, ...props }: PageFooterProps) {
    return (<HStack p={2} px={4} bg="gray.50" justifyContent="flex-end" {...props}>
        {children}
    </HStack>
    )
}

export interface PageToolbarProps extends StackProps {
    children?: any
}

export function PageToolbar({ children, ...props }: PageToolbarProps) {
    const ctx = useContext(PageContext)
    let search;
    React.Children.forEach(children, ele => {
        if (ele?.type?.name === PageSearchProvider.name) {
            search = ele
        }
    })
    return (
        <HStack flex={1} minH="14" justifyContent="flex-end" {...props}>
            {search ?
                <IconButton onClick={e => ctx.setSearchEnabled?.(true)} aria-label="">
                    <Icon>
                        <RXICO_SEARCH />
                    </Icon>
                </IconButton> : ""}
            {children}
        </HStack>
    )
}

export interface PageBodyProps extends StackProps {
    children?: JSX.Element | ((ctx: PageContext) => JSX.Element)
}

export function PageBody({ children, ...props }: PageBodyProps) {
    const ctx = useContext(PageContext)
    return (
        <Stack p={2} px={4} overflowY="auto" flex={1} spacing={0} justifyContent="stretch" {...props}>
            {typeof children === "function" ? children(ctx) : children}
        </Stack>
    )
}

export default {
    PageHeader, Page
}