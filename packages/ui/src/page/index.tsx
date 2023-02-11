import React, { createContext, useContext, useEffect, useState } from "react"
import Box from "../box"
import { HStack, Stack, StackProps } from "../stack"

export interface PageProps extends StackProps {
    children?: any
}
export type PageContext = {
}
export const PageContext = createContext<PageProps & PageContext>({})

export function Page({ children, ...props }: PageProps) {
    const [ctx, setCtx] = useState<PageProps>({ ...(props || {}) })


    let header, toolbar, footer, body;
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

    return (
        <PageContext.Provider value={{
            ...ctx
        }}>
            {(header || toolbar) &&
                <HStack>
                    {header}
                    {toolbar}
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
    return (
        <HStack p={2} flex={1} justifyContent="flex-end" {...props}>
            {children}
        </HStack>
    )
}

export interface PageBodyProps extends StackProps {
    children?: any
}

export function PageBody({ children, ...props }: PageBodyProps) {
    return (
        <Stack overflowY="auto" p={2} flex={1} spacing={0} justifyContent="stretch" {...props}>
            {children}
        </Stack>
    )
}

export default {
    PageHeader, Page
}