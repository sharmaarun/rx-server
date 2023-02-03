import { endOfDay, format, startOfDay } from "@reactive/commons"
import { forwardRef, memo, useCallback, useRef } from 'react'
import { Calendar } from '../calendar'
import { Input } from '../input'
import { Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger } from '../popover'
import { useDisclosure, useOutsideClick } from "../utils/hooks/chakra"
type Props = {
    value?: Date[]
    onChange?: (value: Date[]) => void
    mode?: "single" | "range"
}

export const DateTimeInput = memo(forwardRef(({
    value = [startOfDay(new Date()), endOfDay(new Date())],
    onChange,
    mode = "single"
}: Props, ref: any) => {
    const _onChange = useCallback((d: any) => onChange?.(d), [])
    value = typeof value === "string" ? [new Date(value)] : value.map(v => typeof v === "string" ? new Date(v) : v)
    return (
        <Popover placement="auto-end" >
            <PopoverTrigger>
                <Input ref={ref} minW="56" bg="white" value={format(value?.[0], "dd/MM/yyyy") + (value[1] ? ('-' + format(value[1], "dd/MM/yyyy")) : "")} />
            </PopoverTrigger>
            <PopoverContent minW="500px" shadow="md">
                <PopoverArrow />
                <PopoverBody >
                    <Calendar value={value} onChange={_onChange} mode={mode} />
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}))

export default {
    DateTimeInput
}