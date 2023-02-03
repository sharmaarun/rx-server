import { Link as _Link, LinkProps as _LinkProps } from "@chakra-ui/react"
import { RXICO_LINK } from "@reactive/icons"
import { forwardRef } from "react"
import Box from "../box"
import Icon from "../icon"
import { HStack } from "../stack"
export interface LinkProps extends _LinkProps {
    external?: boolean
}

export const Link = forwardRef(({ children, external = false, ...props }: LinkProps, ref: any) => {
    return (
        <_Link ref={ref} color="brand.500" {...props} >
            {external ? <>
                <Icon w="14px" display="inline">
                    <RXICO_LINK />
                </Icon>
                {children}
            </>
                : children
            }
        </_Link>
    )
})

export default Link