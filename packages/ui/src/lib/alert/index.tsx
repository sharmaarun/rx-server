import { Alert as _Alert, AlertProps as _AlertProps } from "@chakra-ui/react"
export interface AlertProps extends _AlertProps {

}

export function Alert(props: AlertProps) {
    return (
        <_Alert {...props} />
    )
}

export default Alert