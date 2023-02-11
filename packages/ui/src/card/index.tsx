import React from "react"
import { Card as _Card, CardProps as _CardProps } from "@chakra-ui/react"
export interface CardProps extends _CardProps {

}

export function Card(props: CardProps) {
    return (
        <_Card {...props} />
    )
}

export default Card