import React from "react"
import { Heading as _Heading, HeadingProps as _HeadingProps } from "@chakra-ui/react"
export interface HeadingProps extends _HeadingProps {

}

export function Heading(props: HeadingProps) {
    return (
        <_Heading {...props} />
    )
}

export default Heading