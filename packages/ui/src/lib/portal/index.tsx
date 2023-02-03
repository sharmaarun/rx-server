import { Portal as _Portal, PortalProps as _PortalProps } from "@chakra-ui/react"
export interface PortalProps extends _PortalProps {

}

export function Portal(props: PortalProps) {
    return (
        <_Portal {...props} />
    )
}

export default Portal