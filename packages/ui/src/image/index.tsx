import React from "react"
import { Image as _Image, ImageProps as _ImageProps } from "@chakra-ui/react"
import { forwardRef } from "react"
export interface ImageProps extends _ImageProps {

}

export const Image = forwardRef((props: ImageProps, ref: any) => {
    return (
        <_Image ref={ref} {...props} />
    )
})

export default Image