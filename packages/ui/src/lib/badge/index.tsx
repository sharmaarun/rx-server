import { Badge as _Badge, BadgeProps as _BadgeProps } from "@chakra-ui/react"
export interface BadgeProps extends _BadgeProps {

}

export function Badge(props: BadgeProps) {
    return (
        <_Badge {...props} />
    )
}

export default Badge