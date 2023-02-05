import React from "react"
import { Heading, Stack, StackProps as _StackProps } from "@chakra-ui/react";
import Box, { BoxProps } from "../box";
export interface CardProps extends _StackProps {

}

export function Card({ children, ...props }: CardProps) {

    return (
        <Stack
            backgroundColor="card"
            borderRadius={10}
            border={"1px solid"}
            borderColor="borderlight"
            shadow="base"
            alignItems="stretch"
            justifyContent="stretch"
            spacing={0}
            {...props}
        >
            {children}
        </Stack>
    )
}


export interface CardHeaderProps extends BoxProps {
}

export function CardHeader({ children, ...props }: CardHeaderProps) {
    return (
        <Stack p={4}
            zIndex={1}
            position="sticky" {...props}>
            {children}
        </Stack>
    )
}


export interface CardBodyProps extends BoxProps {
}

export function CardBody({ children, ...props }: CardBodyProps) {
    return (
        <Stack p={4} fontSize="sm" {...props}>
            {children}
        </Stack>
    )
}

export interface CardFooterProps extends BoxProps {
}

export function CardFooter({ children, ...props }: CardFooterProps) {
    return (
        <Box p={6} fontSize="sm" {...props}>
            {children}
        </Box>
    )
}


export default Card