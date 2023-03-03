import { ValueEditorContext } from "@reactive/client"
import { DateInput, DateInputProps } from "@reactive/ui"

export interface DateValueEditorProps extends DateInputProps, ValueEditorContext {
    children?: any
}

export function DateValueEditor({ children, ...props }: DateValueEditorProps) {

    return (
        <DateInput {...props}/>
    )
}

export default DateValueEditor