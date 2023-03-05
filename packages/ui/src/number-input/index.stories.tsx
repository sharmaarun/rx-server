import { NumberInput, NumberInputProps } from "./index"
export default {
    title: "Number Input",
    component: NumberInput
}

export const Primary = (props: NumberInputProps) => <NumberInput
    onChange={console.log}
    {...props} />