import { randomId } from "@reactive/commons";
import { createContext, useContext } from "react";

export interface IFormError {
    property: string,
    errors: string[],
    children?: IFormError[]
}
export type FormFieldType = "string" | "number" | "boolean" | "object" | "array";
export interface IFormFieldRegister {
    [name: string]: {
        type: FormFieldType,
        defaultValue?: any
    }
}

export interface IFormContext {
    id: string,
    errors: IFormError[],
    data: any,
    setFieldValue?: (key: string, value: any, cloneKeys?: string[]) => void
    fields: IFormFieldRegister
    registerField?: (name: string, type: FormFieldType, defaultValue?: any) => void
    unregisterField?: (name: string) => void
}

const FormContext = createContext<IFormContext>({
    id: randomId(5),
    errors: [],
    data: {},
    fields: {}
});

export const FormProvider = FormContext.Provider
export const useFormContext = () => useContext(FormContext);

export type UseFormProps = {
    defaultData?: any
    defaultErrors?: IFormError[]
}
