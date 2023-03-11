import React, { useEffect, useRef, useState } from "react"
import { Box, BoxProps } from "../box"
// import CodeFlask from "codeflask"
import { CodeJar } from "codejar"
export interface JSONInputProps extends Omit<BoxProps, "onChange" | "defaultValue" | "value"> {
    children?: any
    onChange?: (code: string) => void
    value?: string
    defaultValue?: string
}

let gid = 0

const highlightJSON = (editor: any) => {
    let code = editor.textContent;
    // replace keys
    code = code.replace(
        /(\".+\")/g,
        '<strong><font color="gray">$1</font></strong>'
    );
    // replace numbers
    code = code.replace(
        /(\:[\s]?)([0-9\.]+)([\s]+)?/g,
        '$1<font color="blue">$2</font>$3'
    );
    // replace boolean
    code = code.replace(
        /(\:[\s]?)(false|true)([\s]+)?/g,
        '$1<font color="tomato">$2</font>$3'
    );

    editor.innerHTML = code;
};
export function JSONInput({ children, defaultValue, onChange, ...props }: JSONInputProps) {

    const [id] = useState("JSON_EDITOR_" + gid++)
    const [invalid, setInvalid] = useState(false)
    const [jar, setJar] = useState<CodeJar>()
    const [val, setVal] = useState<string>()
    useEffect(() => {
        const ele = document?.querySelector("#" + id)
        if (ele && ele !== null) {
            const jar_ = CodeJar(ele as any, highlightJSON)
            if (jar_) {
                jar_.onUpdate((code: string) => setVal(code))
            }
            setJar(jar_)
        }
    }, [])
    useEffect(() => {
        onChange?.(val as any)
    }, [val])
    useEffect(() => {
        if (jar && defaultValue?.length && (!val || val.length <= 0)) {
            try {
                jar.updateCode(JSON.stringify(JSON.parse(defaultValue), null, 4))
                setVal(defaultValue)
            } catch (e) {
                console.error(e)
            }
        }
    }, [defaultValue, jar])

    return (
        <Box

            p={2}
            border="1px solid"
            borderColor="gray.200"
            borderRadius={5}
            transition="all 0.2s"
            _hover={{
                borderColor: "gray.300"
            }}
            _focus={{
                outline: "2px solid blue.500"
            }}

            id={id}
            {...props}
        />
    )
}

export default JSONInput