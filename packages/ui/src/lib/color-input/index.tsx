
import { useEffect, useRef, useState } from "react"
import { ColorResult, SketchPicker, SketchPickerProps } from "react-color"
import Box from "../box"
import { Button } from "../button"
import { Input, InputGroup, InputLeftElement } from "../input"
import { Popover, PopoverBody, PopoverContent, PopoverTrigger } from "../popover"
import Portal from "../portal"
export interface ColorInputProps extends SketchPickerProps {

}

export function ColorInput(props: ColorInputProps) {

    return (
        <SketchPicker {...props} disableAlpha />
    )
}

export interface ColorSelectorProps {
    value?: string
    onChange?: (value: string) => void
}

let itid: any = -1
export function ColorSelector({ onChange, value }: ColorSelectorProps) {
    const [val, setVal] = useState<string>(value || "#000000")

    const _onChange = (color: ColorResult) => {
        setVal(color.hex)
        clearTimeout(itid)
        itid = setTimeout(() => {
            onChange?.(color.hex)
        }, 5)
    }
    const r = useRef<any>()
    return (
        <InputGroup userSelect={"none"}>
            <InputLeftElement zIndex={2} >

                <Popover {...({ zIndex: "100" } as any)} placement="auto-end">
                    <PopoverTrigger {...({ zIndex: "100" } as any)}>
                        <Button
                            color="white"
                            textShadow="1px 1px 1px rgba(0,0,0,0.5)"
                            minW="8"
                            height="8"
                            bg={value || "#000000"}
                            _hover={{
                                opacity: "0.95"
                            }}
                            border="1px solid white"
                            shadow="base"
                            cursor="pointer"
                            variant="link"
                            zIndex={-1}
                        >#</Button>
                    </PopoverTrigger>
                    <Portal >
                        <PopoverContent zIndex={100} >
                            <Box >
                                <ColorInput width="100%"
                                    color={val}
                                    onChange={_onChange}
                                />
                            </Box>
                        </PopoverContent>
                    </Portal>
                </Popover>
            </InputLeftElement>
            {/* <Box flex={1}> */}
            <Input placeholder="#000000" ref={r} pl={10} value={value} onChange={e => _onChange({ hex: e.target.value } as any)} />
            {/* </Box> */}
        </InputGroup>
    )
}



export default {
    ColorInput,
    ColorSelector
}