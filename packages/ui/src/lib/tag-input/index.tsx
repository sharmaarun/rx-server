import { KeyboardEvent, useRef, useState } from "react";
import Box from "../box";
import { CustomFormControl } from "../form";
import { Input, InputProps } from "../input";
import { HStack } from "../stack";
import { Tag, TagCloseButton, TagLabel } from "../tag";

export interface TaggedInputProps extends Omit<InputProps, "value" | "onChange"> {
    validateFn?: (value: string) => boolean
    value?: string[]
    onChange?: (value?: string[] | null) => void
    onInputChange?: (value: string) => void
    breakOnSpace?: boolean
}

export function TaggedInput({ breakOnSpace = false, validateFn, onChange, onInputChange, value = [], ...props }: TaggedInputProps) {
    const [tags, setTags] = useState<string[]>(value || []);
    const [val, setVal] = useState<string>("");
    const ref = useRef<any>()
    const onEnter = (e: any) => {
        if (e.key === "Enter" || (breakOnSpace ? e.key === " " : false)) {
            e.stopPropagation();
            add(e.target.value)
        }
    }
    const onBlur = (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        add(e.target.value)
    }

    const add = (value: string) => {
        if (validateFn && !validateFn(value))
            return;
        setTags([...(tags || []), value])
        onChange?.([...(tags || []), value])
        setTimeout(() => setVal(""), 10);
    }
    const _onChange = (e: KeyboardEvent<HTMLInputElement>) => {
        setVal(e.target.value)
        onInputChange?.(e.target.value)
    }
    const _onRemove = (index: number) => {
        tags?.splice(index, 1);
        setTags([...(tags || [])])
        onChange?.(tags?.length ? [...tags] : null)
    }
    return (
        <CustomFormControl>
            <HStack px={1} flexWrap="wrap" spacing={0}>
                {tags?.length && tags?.map((t, i) => <Box p={1} pr={i >= tags.length - 1 ? 0 : 1}>
                    <Tag >
                        <TagLabel>{t}</TagLabel>
                        <TagCloseButton onClick={() => _onRemove(i)} />
                    </Tag>
                </Box>
                )}
                <Box onKeyDownCapture={onEnter} flex={1}>
                    <Input onBlur={onBlur} border="none" _focusVisible={{ outline: "none" }} {...props} ref={ref} value={val} onChange={_onChange} />
                </Box>
            </HStack>
        </CustomFormControl>
    )
}

export default TaggedInput