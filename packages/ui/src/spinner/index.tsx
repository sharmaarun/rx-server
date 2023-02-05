import React from "react"
import { Spinner as _Spinner, SpinnerProps as _SpinnerProps } from "@chakra-ui/react"
import { forwardRef } from "react"
export interface SpinnerProps extends _SpinnerProps {

}

export const Spinner = forwardRef((props: SpinnerProps, ref: any) => {
    return (
        <_Spinner ref={ref} {...props} />
    )
})

export default Spinner