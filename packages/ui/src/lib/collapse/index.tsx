import { Collapse as _Collapse, CollapseProps as _CollapseProps } from "@chakra-ui/react"
export interface CollapseProps extends _CollapseProps {

}

export function Collapse(props: CollapseProps) {
    return (
        <_Collapse {...props} />
    )
}

export default Collapse