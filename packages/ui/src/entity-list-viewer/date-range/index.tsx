import React, { useEffect, useState } from "react"
import { ActionButton, Button, Calendar, CalendarProps, Card, Heading, HStack, Stack } from "@reactive/ui"

export interface DateRangeInputProps extends CalendarProps {
    children?: any
    defaultValue?: Date[]
    value?: Date[]
}

export function DateRangeInput({ children, onChange, defaultValue, value, ...props }: DateRangeInputProps) {
    const [dateRange, setDateRange] = useState<any>(defaultValue || [])
    useEffect(() => {
        if (
            defaultValue &&
            JSON.stringify(dateRange) !== JSON.stringify(defaultValue)
        ) {
            setDateRange(defaultValue)
        }
    }, [
        defaultValue
    ])
    const clear = () => {
        setDateRange([])
        onChange?.([])
    }
    return (<Stack>
        <Heading size="xs">
            Select Date Range
        </Heading>
        <Card p={4} as={Stack} {...({ spacing: 4 })}>
            <Calendar value={dateRange} {...props} onChange={v => setDateRange(v)} />
        </Card>
        <HStack justifyContent="flex-end">
            <Button onClick={clear}>Clear</Button>
            <ActionButton onClick={e => onChange?.(dateRange)}>Apply</ActionButton>
        </HStack>
    </Stack>
    )
}

export default DateRangeInput