import { Box, BoxProps } from '@chakra-ui/react'
import { plainToInstance } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'
import { Children, cloneElement, createContext, CSSProperties, forwardRef, useContext, useEffect, useState } from 'react'
import { ActionButton, Button, ButtonProps } from '../button'
import Stack, { StackProps } from "../stack"

/**
 * Form Props
 */
export type FormProps = {
    id?: string
    children?: any,
    value?: any
    errors?: ValidationError[]
    middlewares?: FormMiddleware[]
    validationClass?: any
    preSubmit?: (ctx: FormContext) => void | Promise<void>
    onSubmit?: (value: any) => void | Promise<void>
    onFormChange?: (value: any) => void
    defaultValue?: any
    updateOnDefaultValueChange?: boolean
    formStyle?: CSSProperties
}

export type FieldType = "string" | "number" | "float" | "boolean"

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

export type FormMiddleware = (ctx: FormContext) => void | ValidationError[] | Promise<void | ValidationError[]>

/**
 * Form Context Type
 */
export type FormContext = FormProps & {
    stages?: FormStageProps[]
    active?: number
    onChange?: (key: string, value: any) => void
    register?: (key: string, opts: FieldRegisterOpts) => void
    registerStage?: (stage: FormStageProps) => void
    prevStage?: () => void
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
const tids: any = {
    regField: -1,
    regStage: -1,
}
export function Form({ children, ...rest }: FormProps & Omit<StackProps, "defaultValue">) {
    const { validationClass,
        middlewares: mws,
        errors: errs,
        defaultValue,
        updateOnDefaultValueChange,
        onSubmit,
        id,
        onFormChange,
        preSubmit,
        formStyle,
        value,
        ...props
    } = rest || {}
    const fields_: RegisteredFields = {};
    const stages_: FormStageProps[] = [];

    const [fields, setFields] = useState<RegisteredFields>({})
    const [form, setForm] = useState<any>({ ...(value ?? defaultValue ?? {}) })
    const [errors, setErrors] = useState<ValidationError[]>([])
    const [formId] = useState("FORM" + (id ?? formID++))
    const [stages, setStages] = useState<FormStageProps[]>([])
    const [active, setActive] = useState(0)
    const [middlewares, setMiddlewares] = useState<FormMiddleware[]>(mws || [])

    useEffect(() => {
        if (updateOnDefaultValueChange) {
            if (JSON.stringify(form) !== JSON.stringify(defaultValue)) {
                setForm({ ...(defaultValue || {}) })
            }
        }
    }, [defaultValue])

    useEffect(() => {
        if (errs)
            setErrors([...(errors || []), ...errs])
    }, [errs])

    useEffect(() => {
        onFormChange?.(form)
    }, [form])

    useEffect(() => {
        if (JSON.stringify(value) !== JSON.stringify(form)) {
            setForm({ ...value })
        }
    }, [value])

    const register = (key: string, opts: FieldRegisterOpts) => {
        clearTimeout(tids.regField)
        fields_[key] = opts
        tids.regField = setTimeout(() => {
            const _form: any = { ...(form || {}) }
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
        setErrors([])
        let mwErrors: ValidationError[] = []
        let validationErrors: ValidationError[] = []
        if (middlewares.length) {
            for (let middleware of middlewares) {
                try {
                    const mwErrors_ = await middleware({ ...ctx }) as ValidationError[]
                    if (mwErrors_ && mwErrors_.length) {
                        mwErrors = [...mwErrors, ...mwErrors_]
                    }
                } catch (e) {
                    console.error(e)
                    return;
                }
            }
        }



        let validationClass_ = validationClass
        let preSubmit_, onSubmit_;
        if (stages.length) {
            validationClass_ = stages[active]?.validationClass
            preSubmit_ = stages[active]?.preSubmit
            onSubmit_ = stages[active]?.onSubmit
        }


        if (preSubmit_) {
            try {
                await preSubmit_(ctx)
            } catch (e) {
                console.error(e)
                return;
            }
        }


        if (validationClass_) {
            validationErrors = await validate(plainToInstance(validationClass_, form))
        }
        if (validationErrors.length || mwErrors.length) {
            setErrors([...validationErrors, ...mwErrors, ...(errs || [])])
            handleErrors()
            return;
        }


        if (onSubmit_) {
            try {
                onSubmit_?.(form)
            } catch (e) {
                console.error(e)
                return;
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

    const registerStage = (stage: FormStageProps) => {
        clearTimeout(tids.regStage)
        const exists = stages_?.findIndex(s => s.id === stage.id)
        if (exists > -1)
            stages_.splice(exists, 1, stage)
        else
            stages_.push(stage)
        tids.regStage = setTimeout(() => {
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
        id,
        stages,
        registerStage,
        active,
        prevStage,
        defaultValue,
        addMiddleware,
        middlewares
    }

    return (
        <Stack {...props}>
            <form onSubmit={handleSubmit} style={{
                display: "flex",
                flex: 1,
                overflowY: "auto",
                flexDirection: "column",
                ...formStyle
            }}>
                <FormContext.Provider value={ctx}>
                    {children}
                </FormContext.Provider>
            </form>
        </Stack>
    )
}



/**
 * Form Field
 * @param param0 
 * @returns 
 */
export const Field = forwardRef(({
    defaultValue,
    value,
    name,
    children = [],
    type,
    ...props
}: FieldProps, ref: any) => {

    const { onChange, id, register, value: form, errors } = useContext(FormContext)
    const fieldId = id + "_" + name
    useEffect(() => {
        const df = form?.[name] || defaultValue
        register?.(name, { defaultValue: df, type })
    }, [defaultValue])

    const onChange_ = (key: string) => (e: any) => {
        onChange?.(name, type === "boolean" ? e?.target?.checked : e?.target ? e?.target?.value : e)
    }

    const error = errors?.find(e => e.property === name)

    return (<>
        {Children.map(children, (child, index) => {
            return <Box ref={ref} id={fieldId} key={index} {...props}>
                {
                    cloneElement(child, {
                        onChange: onChange_(name),
                        value: form?.[name],
                        defaultValue: form?.[name] || defaultValue,
                        defaultChecked: form?.[name] || defaultValue
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
})

export interface FormStageProps extends Partial<FormProps & StackProps> {
    children?: any
}

export function FormStage({ children, ...props }: FormStageProps) {
    const { registerStage, stages, id: fid, value, active } = useContext(FormContext)
    const stage = stages?.[active || 0]
    const [id] = useState<string>(fid + "-FORMSTAGE-" + (formID++))
    useEffect(() => {
        registerStage?.({
            ...props,
            id
        })
    }, [value])
    const { preSubmit, validationClass, ...rest } = props || {}
    return (
        <Stack {...rest} id={id} display={stage?.id === id ? "" : "none"}>
            {children}
        </Stack>
    )
}

export interface FormBackButtonProps extends ButtonProps {

}
export const FormBackButton = forwardRef(({ children }: FormBackButtonProps, ref: any) => {
    const { prevStage, active = 0, stages = [] } = useContext(FormContext)
    return <Button ref={ref} display={active <= 0 ? "none" : ""} onClick={prevStage}>
        {children}
    </Button>
})

export interface FormSubmitButtonProps extends ButtonProps {

}
export const FormSubmitButton = forwardRef(({ children, ...props }: FormSubmitButtonProps, ref: any) => {
    const { active = 0, stages = [] } = useContext(FormContext)
    return <ActionButton ref={ref} type="submit"  {...props}>
        {active >= stages?.length - 1 ? children : "Next"}
    </ActionButton>
})


import { FormControl as _FormControl, FormControlProps as _FormControlProps } from "@chakra-ui/react"
export interface FieldControlProps extends _FormControlProps {

}

export const FieldControl = forwardRef((props: FieldControlProps, ref: any) => {
    return (
        <_FormControl ref={ref} {...props} />
    )
})

import { FormLabel as _FormLabel, FormLabelProps as _FormLabelProps } from "@chakra-ui/react"

export interface FormLabelProps extends _FormLabelProps {

}

export const FieldLabel = forwardRef((props: FormLabelProps, ref: any) => {
    return (
        <_FormLabel ref={ref} {...props} />
    )
})

import { Text, TextProps } from "@chakra-ui/react"

export interface FormFieldDescriptionProps extends TextProps {
    children?: any
}

export const FieldDescription = forwardRef(({ children, ...props }: FormFieldDescriptionProps, ref: any) => {
    return (
        <Text ref={ref} pl={2} fontSize="xs" {...props}>
            {children}
        </Text>
    )
})

export const useFormContext = () => useContext(FormContext)