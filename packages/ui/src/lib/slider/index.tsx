import { Slider as _Slider, SliderFilledTrack as _SliderFilledTrack, SliderProps as _SliderProps, SliderThumb as _SliderThumb, SliderThumbProps as _SliderThumbProps, SliderTrack as _SliderTrack, SliderTrackProps as _SliderTrackProps } from "@chakra-ui/react"
import { startTransition, useEffect, useState } from "react"
import Box from "../box"
import { HStack } from "../stack"
export interface SliderProps extends _SliderProps {

}

export function Slider(props: SliderProps) {
    return (
        <_Slider {...props} />
    )
}

export interface SliderThumbProps extends _SliderThumbProps {

}

export function SliderThumb(props: SliderThumbProps) {
    return (
        <_SliderThumb {...props} />
    )
}

export interface SliderFilledTrackProps extends _SliderTrackProps {

}

export function SliderFilledTrack(props: SliderFilledTrackProps) {
    return (
        <_SliderFilledTrack {...props} />
    )
}

export interface SliderTrackProps extends _SliderTrackProps {

}

export function SliderTrack(props: SliderTrackProps) {
    return (
        <_SliderTrack {...props} />
    )
}

export interface SimpleSliderProps extends SliderProps {

}
export function SimpleSlider({ value, ...props }: SimpleSliderProps) {
    const [val, setVal] = useState(value ?? props?.defaultValue ?? 0)
    useEffect(() => {
        if (val !== value) {
            setVal(parseInt(value + "") ?? 0)
        }
    }, [value])
    const _onChange = (value: number) => {
        setVal(value);
        startTransition(()=>props?.onChange?.(value))
    }
    return (
        <Slider  {...props} value={val} onChange={_onChange} >
            <Box
                id={"tst"}
                pos="relative"
            >
                <HStack
                    pos="absolute"
                    w="100%"
                >
                    <Box>{props.min}</Box>
                    <Box flex={1}></Box>
                    <Box>{props.max}</Box>
                </HStack>
            </Box>
            <SliderTrack>
                <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb w="8" h="8">
                {val}
            </SliderThumb>
        </Slider>
    )
}


export default {
    SimpleSlider,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
}