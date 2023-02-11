import { Box, BoxProps } from '@chakra-ui/react'
import { plainToInstance } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'
import { Children, cloneElement, createContext, useContext, useEffect, useState } from 'react'
import { ActionButton, Button, ButtonProps } from '../button'
import Stack from "../stack"

/**
 * Form Props
 */
export type FormProps = BoxProps & {
    children?: any,
    validationClass?: any
    onSubmit?: (value: any) => void
    onChange?: (value: any) => void
    defaultValue?: any
}

export type FieldType = "string" | "number" | "float"

/**
 * Form Field Props
 */
export type FieldProps = BoxProps & {
    children?: any
    name: string
    defaultValue?: any
    value?: any
    type?: FieldType
}

export type RegisteredFields = { [key: string]: FieldRegisterOpts }

export type FormMiddleware = (ctx: FormContext) => void | Promise<void>

/**
 * Form Context Type
 */
export type FormContext = Omit<FormProps, "onChange"> & {
    onChange?: (key: string, value: any) => void
    register?: (key: string, opts: FieldRegisterOpts) => void
    value?: any
    errors?: ValidationError[]
    formId?: string
    stages?: FormStageProps[]
    addStage?: (stage: FormStageProps) => void
    active?: number
    prevStage?: () => void
    middlewares?: FormMiddleware[]
    addMiddleware?: (middleware: FormMiddleware) => void
}

export type FieldRegisterOpts = {
    defaultValue?: string
    type?: FieldType
}

/**
 * Form Context
 */
export const FormContext = createContext<FormContext>({})

let formID = 0;
let formStageID = 0;

/**
 * Form
 * @param param0 
 * @returns 
 */
export function Form({ children, validationClass, middlewares: mws, errors: errs, defaultValue, onSubmit }: FormContext) {

    const fields_: RegisteredFields = {};
    const stages_: FormStageProps[] = [];
    let tid: any = -1
    let tid2: any = -1

    const [fields, setFields] = useState<RegisteredFields>({})
    const [form, setForm] = useState<any>({ ...(defaultValue || {}) })
    const [errors, setErrors] = useState<ValidationError[]>(errs || [])
    const [formId] = useState("FORM" + formID++)
    const [stages, setStages] = useState<FormStageProps[]>([])
    const [active, setActive] = useState(0)
    const [middlewares, setMiddlewares] = useState<FormMiddleware[]>(mws || [])



    useEffect(() => {
        if (errs)
            setErrors(errs)
    }, [errs])

    const register = (key: string, opts: FieldRegisterOpts) => {
        clearTimeout(tid)
        fields_[key] = opts
        tid = setTimeout(() => {
            const _form: any = {}
            for (let key in fields_) { _form[key] = fields_[key]?.defaultValue }
            setForm({ ..._form })
            setFields({ ...fields_ })
        }, 50)
    }

    const addMiddleware = (fn: FormMiddleware) => {
        setMiddlewares([...middlewares, fn])
    }

    const onChange = (key: string, value: any) => {
        setForm({ ...form, [key]: value })
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        e.stopPropagation()
        let validationClass_ = validationClass
        if (stages.length) {
            validationClass_ = stages[active]?.validationClass
        }
        if (validationClass_) {
            setErrors([])
            const errors_ = await validate(plainToInstance(validationClass_, form))
            if (errors_.length) {
                setErrors([...errors_])
                handleErrors()
                return;
            }
        }
        if (middlewares.length) {
            for (let middleware of middlewares) {
                try {
                    await middleware({ ...ctx })
                } catch (e) {
                    console.error(e)
                    return;
                }
            }
        }
        if (stages.length && active < stages.length - 1) {
            setActive(active + 1)
        } else {
            onSubmit?.(transform(form))
        }
        return false
    }

    const handleErrors = () => {
        if (typeof window !== "undefined") {
            const ele = document?.getElementById(formId + "_" + errors?.[0]?.property)
            const eleTop = (ele?.getBoundingClientRect()?.top || 0)
            const y = (eleTop || 0)
            if (y - 200 <= 0) return;
            window.scroll({
                top: y - 200,
                behavior: "smooth"
            })

        }
    }

    const transform = (form: any = {}) => {
        for (let k in form) {
            if (fields?.[k]?.type === "number") {
                form[k] = parseInt(form[k])
            }
            if (fields?.[k]?.type === "float") {
                form[k] = parseFloat(form[k])
            }
        }
        return form;
    }

    const addStage = (stage: FormStageProps) => {
        clearTimeout(tid2)
        stages_.push(stage)
        tid2 = setTimeout(() => {
            setStages([...stages_])
        }, 50)
    }

    const prevStage = () => {
        setActive(active <= 0 ? 0 : active - 1)
    }

    const ctx: FormContext = {
        onChange,
        value: form,
        errors,
        register,
        formId,
        stages,
        addStage,
        active,
        prevStage,
        defaultValue,
        addMiddleware,
        middlewares
    }

    return (
        <form onSubmit={handleSubmit}>
            <FormContext.Provider value={ctx}>
                {children}
            </FormContext.Provider>
        </form>
    )
}



/**
 * Form Field
 * @param param0 
 * @returns 
 */
export function Field({
    defaultValue,
    value,
    name,
    children = [],
    type,
    ...props
}: FieldProps) {

    const { onChange, formId, register, value: form, errors } = useContext(FormContext)
    const fieldId = formId + "_" + name
    useEffect(() => {
        const df = form?.[name] || defaultValue
        register?.(name, { defaultValue: df, type })
    }, [defaultValue])

    const onChange_ = (key: string) => (e: any) => {
        onChange?.(name, e.target ? e.target.value : e)
    }

    const error = errors?.find(e => e.property === name)

    return (<>
        {Children.map(children, (child, index) => {
            return <Box id={fieldId} key={index} {...props}>
                {
                    cloneElement(child, {
                        onChange: onChange_(name),
                        value,
                        defaultValue: form?.[name] || defaultValue
                    })
                }
                {error && <>
                    {Object.values(error.constraints || {})?.map((e, ind) =>
                        <Box px={2} pt={2} key={ind} color="red.500">{e}</Box>
                    )}
                </>}
            </Box>
        })}
    </>)
}

export interface FormStageProps extends Partial<FormProps> {
    children?: any
}

export function FormStage({ children, ...props }: FormStageProps) {
    const { addStage, stages, formId: fid, active } = useContext(FormContext)
    const stage = stages?.[active || 0]
    const [id] = useState<string>(fid + "-FORMSTAGE-" + (formID++))
    useEffect(() => {
        addStage?.({
            ...props,
            id
        })
    }, [])
    return (
        <Stack {...props} id={id} display={stage?.id === id ? "" : "none"}>
            {children}
        </Stack>
    )
}

export interface FormBackButtonProps extends ButtonProps {

}
export const FormBackButton = ({ children }: FormBackButtonProps) => {
    const { prevStage, active = 0, stages = [] } = useContext(FormContext)
    return <Button display={active <= 0 ? "none" : ""} onClick={prevStage}>
        {children}
    </Button>
}

export interface FormSubmitButtonProps extends ButtonProps {

}
export const FormSubmitButton = ({ children, ...props }: FormSubmitButtonProps) => {
    const { active = 0, stages = [] } = useContext(FormContext)
    return <ActionButton type="submit"  {...props}>
        {active >= stages?.length - 1 ? children : "Next"}
    </ActionButton>
}


import { FormControl as _FormControl, FormControlProps as _FormControlProps } from "@chakra-ui/react"
export interface FieldControlProps extends _FormControlProps {

}

export function FieldControl(props: FieldControlProps) {
    return (
        <_FormControl {...props} />
    )
}

import { FormLabel as _FormLabel, FormLabelProps as _FormLabelProps } from "@chakra-ui/react"

export interface FormLabelProps extends _FormLabelProps {

}

export function FieldLabel(props: FormLabelProps) {
    return (
        <_FormLabel {...props} />
    )
}

import { Text, TextProps } from "@chakra-ui/react"
import { Middleware } from 'webpack-dev-server'

export interface FormFieldDescriptionProps extends TextProps {
    children?: any
}

export function FieldDescription({ children, ...props }: FormFieldDescriptionProps) {
    return (
        <Text pl={2} fontSize="xs" {...props}>
            {children}
        </Text>
    )
}

export const useFormContext = () => useContext(FormContext)