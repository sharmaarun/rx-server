import { RXICO_PLUS, RXICO_SEARCH } from "@reactive/icons"
import React, { createContext, useContext, useState } from "react"
import Box from "../box"
import { Icon, IconButton } from "../icon"
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
    let header, toolbar, footer, body;

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
                <HStack>
                    {ctx.searchEnabled ?
                        <Box flex={1} p={2}>
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
            {body}
            {footer}
        </PageContext.Provider >
    )
}
export interface PageHeaderProps extends StackProps {
    children?: any
}

export function PageHeader({ children, ...props }: PageHeaderProps) {
    return (<Stack p={2} pl={4}>
        {children}
    </Stack>
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

export interface PageFooterProps extends StackProps {
    children?: any
}

export function PageFooter({ children, ...props }: PageFooterProps) {
    return (<HStack bg="gray.50" justifyContent="flex-end" p={2}>
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
        <HStack p={2} flex={1} justifyContent="flex-end" {...props}>
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
        <Stack overflowY="auto" p={2} flex={1} spacing={0} justifyContent="stretch" {...props}>
            {typeof children === "function" ? children(ctx) : children}
        </Stack>
    )
}

export default {
    PageHeader, Page
}