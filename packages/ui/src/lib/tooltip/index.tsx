import { Tooltip as _Tooltip, TooltipProps as _TooltipProps } from "@chakra-ui/react"
import { forwardRef } from "react"
export interface TooltipProps extends _TooltipProps {

}

export const Tooltip = forwardRef((props: TooltipProps, ref: any) => {
    return (
        <_Tooltip {...props} />
    )
})

export default Tooltip