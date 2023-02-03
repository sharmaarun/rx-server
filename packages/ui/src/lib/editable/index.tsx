import { Editable as _Editable, EditableProps as _EditableProps } from "@chakra-ui/react"
export interface EditableProps extends _EditableProps {

}

export const Editable = forwardRef((props: EditableProps, ref: any) => {
    return (
        <_Editable ref={ref} {...props} />
    )
})

import { EditablePreview as _EditablePreview, EditablePreviewProps as _EditablePreviewProps } from "@chakra-ui/react"
export interface EditablePreviewProps extends _EditablePreviewProps {

}

export const EditablePreview = forwardRef((props: EditablePreviewProps, ref: any) => {
    return (
        <_EditablePreview ref={ref} {...props} />
    )
})

import { EditableInput as _EditableInput, EditableInputProps as _EditableInputProps } from "@chakra-ui/react"
import { forwardRef } from "react"
import Tooltip from "../tooltip"
export interface EditableInputProps extends _EditableInputProps {

}

export function EditableInput(props: EditableInputProps) {
    return (
        <_EditableInput {...props} />
    )
}

export interface InputEditableProps extends EditableProps {

}

export function InputEditable(props: InputEditableProps) {
    return (
        <Tooltip label="Click to edit">
            <Editable {...(props as any)}>
                <EditablePreview />
                <EditableInput />
            </Editable>
        </Tooltip>
    )
}

export default {
    InputEditable,
    Editable,
    EditableInput,
    EditablePreview
}
