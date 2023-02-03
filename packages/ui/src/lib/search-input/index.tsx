import { InputProps as _InputProps } from "@chakra-ui/react";
import { forwardRef } from "react";
import Icon from "../icon";
import { Input, InputGroup, InputLeftElement } from "../input";
import Spinner from "../spinner";
export interface SearchInputProps extends _InputProps {
    icon?: any;
    isLoading?: boolean;
}

export const SearchInput = forwardRef(({ icon, isLoading, ...props }: SearchInputProps, ref: any) => {
    props.height = props.height || props.h || "12"
    return (
        <InputGroup  {...props} role="group" alignItems="center">
            <InputLeftElement alignItems="center" color="textalpha" _groupFocusWithin={{ color: "brand.500" }} {...props}>
                {isLoading ? <Spinner /> :
                    <Icon>{icon}</Icon>}
            </InputLeftElement>
            <Input ref={ref} pl={10} placeholder="search" {...props} />
        </InputGroup >
    )
})

export default SearchInput