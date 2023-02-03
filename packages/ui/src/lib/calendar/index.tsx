import { addDays, addMonths, addYears, compareAsc, endOfDay, endOfMonth, endOfWeek, endOfYear, format, getDay, getDaysInMonth, getMonth, isAfter, isBefore, setMonth, startOfDay, startOfMonth, startOfWeek, startOfYear } from "@reactive/commons"
import { RXICO_BACKWARD, RXICO_FORWARD, RXICO_NEXT, RXICO_PREVIOUS } from "@reactive/icons"
import React, { memo, ReactElement, useCallback } from 'react'
import Box from '../box'
import { Button } from '../button'
import Icon from '../icon'
import Stack, { HStack } from '../stack'
import Text from "../text"

export interface ICalendarDisabledDates {
    after?: Date,
    before?: Date,
    range?: Date[]
}

export interface ITaggedCalendarDate {
    label?: string;
    dateRange?: Date[];
}

interface Props {
    value?: Date[];
    onChange?: (dateRange: Date[]) => void;
    mode?: "single" | "range";
    view?: "single" | "double";
    disabled?: ICalendarDisabledDates;
    taggedDates?: ITaggedCalendarDate[]
}

export const Calendar = memo(({
    value,
    onChange,
    mode,
    disabled,
    view,
    taggedDates = [
        {
            label: "Today",
            dateRange: [
                startOfDay(new Date()),
                endOfDay(new Date())
            ]
        },
        {
            label: "Yesterday",
            dateRange: [
                startOfDay(addDays(new Date(), -1)),
                endOfDay(addDays(new Date(), -1))
            ]
        },
        {
            label: "Last 7 Days",
            dateRange: [
                startOfDay(addDays(new Date(), -7)),
                endOfDay(new Date())
            ]
        },
        {
            label: "This week",
            dateRange: [
                startOfWeek(new Date()),
                endOfWeek(new Date())
            ]
        },
        {
            label: "Last 15 Days",
            dateRange: [
                startOfDay(addDays(new Date(), -15)),
                endOfDay(new Date())
            ]
        },
        {
            label: "Last 30 Days",
            dateRange: [
                startOfDay(addDays(new Date(), -30)),
                endOfDay(new Date())
            ]
        },
        {
            label: "This Month",
            dateRange: [
                startOfMonth(new Date()),
                endOfMonth(new Date())
            ]
        },
        {
            label: "Last 6 Months",
            dateRange: [
                startOfDay(addMonths(new Date(), -6)),
                endOfDay(new Date())
            ]
        },
        {
            label: "This Year",
            dateRange: [
                startOfYear(new Date()),
                endOfYear(new Date())
            ]
        },
        {
            label: "Last Year",
            dateRange: [
                startOfYear(addYears(new Date(), -1)),
                endOfYear(addYears(new Date(), -1))
            ]
        },

    ]
}: Props): ReactElement => {

    const [_dates, setDates] = React.useState(value || []);
    const [cDate, setCDate] = React.useState(new Date());
    const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
    const numOfDays = Array.from(Array(getDaysInMonth(cDate)).keys());

    React.useEffect(() => {
        setDates(value || []);
    }, [value])

    const prevMonth = () => {
        setCDate(addMonths(cDate, -1));
    }

    const nextMonth = () => {
        setCDate(addMonths(cDate, 1));
    }

    const prevYear = () => {
        setCDate(addYears(cDate, -1));
    }

    const nextYear = () => {
        setCDate(addYears(cDate, 1));
    }

    const _setDates = (dates: Date[]) => {
        if (onChange) {
            onChange(dates);
        }
        setDates([...dates]);

    }

    const selectDate = useCallback((date: Date) => {
        if (mode === "single") {
            _setDates([date])
        } else if (mode === "range") {
            if (_dates.length < 1 || _dates.length > 1) {
                _setDates([startOfDay(date)])
            } else if (_dates[0] && isBefore(date, _dates[0])) {
                _setDates([startOfDay(date), endOfDay(_dates[0])])
            } else if (_dates[0] && isAfter(date, _dates[0])) {
                _setDates([startOfDay(_dates[0]), endOfDay(date)])
            } else if (compareAsc(_dates[0], date) === 0) {
                _setDates([startOfDay(_dates[0]), endOfDay(date)])
            }
        }
    }, [_dates, mode])


    return (
        <Stack
            w="100%"
        >
            <HStack
                spacing={2}
                w="100%"
            >
                <HStack flex={1} justifyContent="flex-start">
                    <Button
                        onClick={() => prevYear()}
                        variant="ghost"
                    >
                        <Icon><RXICO_PREVIOUS /></Icon>
                    </Button>
                    <Button
                        onClick={() => prevMonth()}
                        variant="ghost"
                    >
                        <Icon ><RXICO_BACKWARD /></Icon>
                    </Button>
                </HStack>
                <HStack
                    flex="1"
                    justifyContent={"center"}
                >
                    <Box
                        fontWeight="bold"
                    >
                        {format(cDate, "yyyy")}
                    </Box>
                </HStack>
                <HStack flex={1} justifyContent="flex-end">
                    <Button
                        onClick={() => nextMonth()}
                        variant="ghost"
                    >
                        <Icon ><RXICO_FORWARD /></Icon>
                    </Button>
                    <Button
                        onClick={() => nextYear()}
                        variant="ghost"
                    >
                        <Icon ><RXICO_NEXT /></Icon>
                    </Button>
                </HStack>

            </HStack>

            <HStack overflowY={["auto"]} alignItems="start" flexDir={["column", "column", "row"]} spacing={[0, 0, 2]}>
                {Array.from(Array(view === "double" ? 2 : 1).keys()).map(i => {
                    let cMonth = startOfMonth(cDate);
                    cMonth = setMonth(cMonth, getMonth(cMonth) + (1 * i));
                    return (
                        <Box key={"dts"+i}>
                            <HStack py={4} justifyContent="center">
                                <Box
                                    fontWeight="bold"
                                >
                                    {i === 0 ?
                                        <>{format(cDate, "MMMM, yyyy")}</> :
                                        <>{format(addMonths(cDate, 1), "MMMM, yyyy")}</>
                                    }
                                </Box>
                            </HStack>
                            <HStack
                                w={"100%"}
                                paddingY={2}
                                background={"brand.50"}
                            >
                                {weekDays.map((day, index) => (
                                    <HStack
                                        w={(100 / 7) + "%"}
                                        key={day+"-"+index}
                                        alignItems={"center"}
                                        justifyContent={"center"}
                                        fontWeight={"bold"}

                                    >
                                        <Text>
                                            {day}
                                        </Text>
                                    </HStack>
                                ))}
                            </HStack>
                            <HStack
                                w={"100%"}
                                flexWrap={"wrap"}
                                spacing={0}
                            >
                                {Array.from(Array(getDay(cMonth) + 1).keys()).map((day, index) => (
                                    <HStack
                                        w={(100 / 7) + "%"}
                                        key={day+"-"+index}
                                        alignItems={"flex-end"}
                                        justifyContent={"center"}
                                    >


                                    </HStack>))}
                                {numOfDays.map((day, index) => {
                                    const cd = addDays(cMonth, day);
                                    const inRange = _dates[1] ?
                                        compareAsc(cd, _dates[0]) >= 0 && compareAsc(cd, _dates[1]) <= 0
                                        :
                                        compareAsc(cd, _dates[0]) === 0;
                                    const isStart = compareAsc(cd, _dates[0]) === 0;
                                    const isEnd = compareAsc(endOfDay(cd), _dates[1]) === 0;
                                    const isDisabled = (disabled?.after && compareAsc(cd, disabled?.after) > 0) ||
                                        (disabled?.before && compareAsc(cd, disabled?.before) < 0) || disabled?.range?.includes(cd)
                                    return (
                                        <Button
                                            w={(100 / 7) + "%"}
                                            minW="auto"
                                            key={day+"-"+index}
                                            flexDirection={"row"}
                                            // alignItems={"flex-end"}
                                            justifyContent={"center"}
                                            // paddingY={2}
                                            _hover={!isDisabled && !(isStart || isEnd) ? {
                                                background: "brand.50"
                                            } : {}}
                                            _active={{ background: "brand.200" }}
                                            color={
                                                isDisabled ? "textdisabled" :
                                                    ""
                                            }
                                            background={
                                                inRange ? "brand.100" : "transparent"
                                            }
                                            {...((isStart || isEnd) ? {
                                                background: "brand.400",
                                                color: "white"
                                            } as any : {})}

                                            onClick={() => !isDisabled && selectDate(cd)}
                                            borderLeftRadius={isStart ? "0.5rem" : "0"}
                                            borderRightRadius={(mode === "single" || isEnd) ? "0.5rem" : "0"}
                                            cursor={"pointer"}
                                            borderRadius={0}
                                            fontWeight={inRange ? "semibold" : "inherit"}
                                            fontSize="inherit"
                                        // color={isBefore?"gray.300":"black"}
                                        >
                                            <Text {...(compareAsc(cd, startOfDay(new Date())) == 0 ? {
                                                borderBottom: "1px solid",
                                                fontWeignt: "bold",
                                                color: inRange ? "" : "brand.500"
                                            } : {})}>
                                                {day + 1}
                                            </Text>
                                        </Button>

                                    )
                                })}
                            </HStack>
                        </Box>)
                })
                }
            </HStack>
            {
                taggedDates?.length && mode === "range" &&
                <HStack
                    py={4}
                    overflow="auto"
                >
                    {taggedDates?.map((td, i) => <>
                        <Button
                            key={td.label+"-"+i}
                            variant="outline"
                            flexShrink={0}
                            w="auto"
                            display="inline"
                            minW="12"
                            size="xs"
                            colorScheme="brand"
                            onClick={() => td?.dateRange && _setDates(td?.dateRange)}
                        >{td?.label}</Button>
                    </>)}
                </HStack>
            }
        </Stack >
    )
})

export default Calendar
