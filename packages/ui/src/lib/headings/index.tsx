import { Heading as _Heading, HeadingProps as _HeadingProps } from "@chakra-ui/react"
import { forwardRef } from "react"
export interface HeadingProps extends _HeadingProps {
}

export const H1=forwardRef((props: HeadingProps,ref:any)=> {
    return (
        <_Heading ref={ref} size="2xl" {...props}/>
    )
})
export const H2=forwardRef((props: HeadingProps,ref:any)=> {
    return (
        <_Heading ref={ref} size="lg" {...props}/>
    )
})
export const H3=forwardRef((props: HeadingProps,ref:any)=> {
    return (
        <_Heading ref={ref} size="md" {...props}/>
    )
})
export const H4=forwardRef((props: HeadingProps,ref:any)=> {
    return (
        <_Heading ref={ref} size="sm" {...props}/>
    )
})
export const H5=forwardRef((props: HeadingProps,ref:any)=> {
    return (
        <_Heading ref={ref} size="xs" {...props}/>
    )
})
export const H6=forwardRef((props: HeadingProps,ref:any)=> {
    return (
        <_Heading ref={ref} size="xs" fontWeight="normal" {...props}/>
    )
})

export default {
    H1,
    H2,
    H3,
    H4,
    H5,
    H6
}