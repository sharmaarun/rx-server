import { useState } from "react"
import _Pagination, { PaginationProps } from "rc-pagination"
export type { PaginationLocale } from "rc-pagination"
import 'rc-pagination/assets/index.css'
interface Props extends PaginationProps {
}

export function Pagination({
    ...props
}: Props) {

    return (
        <_Pagination {...props} />
    )
}

export default Pagination