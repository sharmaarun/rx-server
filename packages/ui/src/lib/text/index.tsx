import { Text as _Text, TextProps as _TextProps } from "@chakra-ui/react"
export interface TextProps extends _TextProps {

}

export function Text(props: TextProps) {
    return (
        <_Text {...props} />
    )
}

export default Text