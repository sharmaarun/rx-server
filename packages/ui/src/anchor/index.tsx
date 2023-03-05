import React from "react"
import { Link, LinkProps } from "@chakra-ui/react"

export interface AnchorProps extends LinkProps {
     children?:any
}

export function Anchor({children, ...props}: AnchorProps) {
    return (
        <Link {...props}>
            {children}
        </Link>
    )
}

export default Anchor