import React, { forwardRef } from "react"
import { Card as _Card, CardProps as _CardProps } from "@chakra-ui/react"
export interface CardProps extends _CardProps {

}

export const Card = forwardRef((props: CardProps, ref: any) => {
    return (
        <_Card {...props} ref={ref} />
    )
})

export default Card