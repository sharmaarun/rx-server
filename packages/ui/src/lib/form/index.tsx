// import { FormControl as _FormControl, FormControlProps as _FormControlProps, FormLabel } from "@chakra-ui/react";
import { FormControl as _FormControl, FormControlProps as _FormControlProps, FormLabel as _FormLabel, FormLabelProps as _FormLabelProps } from "@chakra-ui/react";
import { randomId, uuidv4, validateDTO } from "@reactive/commons";
import React, { Component, memo, useCallback, useEffect, useMemo, useState } from "react";
import { Box } from "../box";
import { Stack } from "../stack";
import { FormFieldType, FormProvider, IFormError, IFormFieldRegister, useFormContext } from "../utils/hooks/use-form";
export interface FormLabelProps extends _FormLabelProps {

}

export function FormLabel(props: FormLabelProps) {
    return (
        <_FormLabel {...props} />
    )
}

export interface FormControlProps extends _FormControlProps {

}

export function FormControl(props: FormControlProps) {
    return (
        <_FormControl {...props} />
    )
}
export interface CustomFormControlProps extends _FormControlProps {

}

export function CustomFormControl(props: CustomFormControlProps) {
    return (
        <_FormControl
            _focusWithin={{ outline: "2px solid ", outlineColor: "brand.600" }}
            _focusVisible={{ outline: "2px solid ", outlineColor: "brand.600" }}
            border="1px solid"
            borderColor="inputborder"
            transition="0.2s all"
            _hover={{
                transition: "0.2s all",
                borderColor: "inputborderhover"
            }}
            borderRadius="5"
            overflow="hidden"
            {...props} />
    )
}

export interface FieldProps extends Omit<_FormControlProps, "defaultValue"> {
    label?: any
    isChecked?: boolean
    name: string
    type?: FormFieldType
    controlProps?: any
    children?: any;
    validationClass?: any,
    helpText?: any;
    error?: any;
    dependencies?: any
    serialize?: (string: any) => any
    deSerialize?: (value: any) => any
    defaultValue?: any;
    rawDeps?: any;
    cloneKeys?: string[]
}

export interface FormProps {
    onSubmit?: (data: any) => void,
    children?: ((props: Partial<FormProps>) => JSX.Element) | JSX.Element,
    onChange?: (data: any) => void,
    formProps?: React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>
    validationClass?: any,
    errors?: IFormError[]
    value?: any
    defaultValue?: any
    noFormTag?: boolean
    sync?: boolean
    id?: string
    autoInitialize?: boolean
    updateDelay?: number
    shouldComponentUpdate?: () => boolean
}

export const Field = memo(({
    label,
    type = "string",
    name,
    controlProps,
    children,
    helpText,
    error,
    onChange,
    validationClass,
    dependencies = [],
    serialize,
    deSerialize,
    defaultValue,
    rawDeps,
    cloneKeys,
}: FieldProps) => {
    let { data, errors, setFieldValue, registerField, id, unregisterField } = useFormContext()
    useEffect(() => {
        registerField?.(name, type, defaultValue)
        return () => unregisterField?.(name)
    }, [type, defaultValue, name])
    const fieldErrors = errors?.filter(x => x.property === name)?.[0]
    const { children: innerErrors } = fieldErrors || {}
    const value = deSerialize ? deSerialize(data?.[name]) : data?.[name]
    const _onChange = useCallback((v: any) => {
        v = type === "boolean" ? v?.target?.checked : v?.target?.value !== undefined ? v?.target?.value : v
        v = serialize ? serialize(v) : v
        setFieldValue?.(name, v, cloneKeys || [])
    }, [data?.[name], setFieldValue, serialize])
    const deps = dependencies.map((v: any) => data?.[v] || "")
    const child = useMemo(() => {
        return children ? React.cloneElement(children, {
            value,
            ...(type === "boolean" ? (value!) ? { isChecked: value } : { isChecked: false } : {}),
            onChange: _onChange,
            errors: innerErrors,
            defaultValue
        }) : <></>
    }, [data?.[name], ...deps, ...(rawDeps || [])])
    return (!children ? <></> : (
        <FormControl id={id + "_FORM_FIELD_" + name} {...controlProps} >
            {label && <FormLabel pl={1}>
                {label}
            </FormLabel>}
            <Stack>
                {child}
                {helpText && <Box pl={1} color="textalpha">{helpText}</Box>}
                {fieldErrors?.errors?.length > 0 && <Box pl={1}>
                    <Box color="red">{fieldErrors?.errors?.join(", ")}</Box>
                </Box>}
            </Stack>
        </FormControl >
    ))
})

export type FormState = {
    data: any
    errors: IFormError[]
    fields: IFormFieldRegister
}

export class Form extends Component<FormProps, FormState>{
    public static defaultProps = {
        autoInitialize: false
    }
    private fields: any = [];
    private itid: any = -1
    private unregItid: any = -1
    constructor(props: FormProps) {
        super(props)
        this.state = {
            data: props.value || {},
            errors: props.errors || [],
            fields: {}
        }
        this.fields = []
        this.setFieldValue = this.setFieldValue.bind(this)
        this.registerField = this.registerField.bind(this)
    }

    override shouldComponentUpdate(nextProps: Readonly<FormProps>, nextState: Readonly<FormState>, nextContext: any): boolean {
        const differentForm = this.props.id !== nextProps.id
        if (this.state.data !== nextState.data) {
            this.setState(s => ({
                ...s,
                data: { ...(nextState.data || {}) },
            }),
                this.forceUpdate
            )
            return true;
        } else if (nextProps.value !== this.props.value) {
            this.setState(s => ({
                ...s,
                data: { ...(nextProps.value || {}) },
            }), () => {
                this.forceUpdate()
            })
            return true;
        }
        if (
            JSON.stringify(this.props.errors) !== JSON.stringify(nextProps.errors) ||
            differentForm
        ) {
            let val = differentForm ? (nextProps.value || {}) : (nextState.data || {})
            if (this.props.autoInitialize && Object.keys(val).length <= 0) {
                for (let field of Object.keys(this.state.fields) || []) {
                    const { type, defaultValue } = this.state.fields[field] || {}
                    val[field] =
                        type === "string" ? defaultValue ?? "" :
                            type === "number" ? defaultValue ?? 0 :
                                type === "array" ? defaultValue ?? [] :
                                    type === "boolean" ? defaultValue ?? false :
                                        type === "object" ? defaultValue ?? {} : defaultValue ?? undefined
                }
            }
            this.setState(s => ({
                ...s,
                data: { ...(val || {}) },
                errors: [...(nextProps?.errors || [])]
            }))
            return true;
        }

        if (this.props?.shouldComponentUpdate?.()) {
            return true
        }
        return false;
    }

    private setFieldValue(key: string, value: any, cloneKeys: string[] = []) {
        clearTimeout(this.itid)
        this.itid = setTimeout(() => {
            const { type } = this.state.fields?.[key] || {}
            if (type === "boolean") {
                value = value === "false" ? false : value === "true" ? true : value! ? true : false
            }
            if (type === "number") {
                value = parseInt(value + "")
            }
            const clonedValues: any = {}
            for (let k of cloneKeys) {
                clonedValues[k] = value
            }
            this.setState({
                data: {
                    ...this.state.data,
                    [key]: value,
                    ...clonedValues
                }
            }, () => {
                this.props?.onChange?.(this.state.data)
            })
        }, this.props.updateDelay || 0)
    }

    private registerField = (name: string, type: FormFieldType, defaultValue?: any) => {
        clearTimeout(this.itid)
        this.fields.push({ [name]: { type, defaultValue } })
        this.itid = setTimeout(() => {
            let fields = {};
            for (let v of this.fields) {
                fields = { ...fields, ...v }
            }
            this.setState({ fields: { ...fields } }, () => {
            })
        }, 0)
    }

    private unregisterField(name: string) {
        this.fields = this.fields.filter((f: any) => !f[name]!)
        clearTimeout(this.unregItid)
        this.unregItid = setTimeout(() => {
            this.setState({ fields: { ...this.fields } }, () => {
            })
        }, 0)
    }

    private handleErrors(__errors: any) {
        const fieldName = "#FORM_FIELD_" + __errors?.[0]?.property;
        if (typeof window !== "undefined") {
            document.querySelector(fieldName)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    private onSubmit(d: any) {
        this.setState({ errors: [] }, async () => {
            if (this.props?.validationClass) {
                const _errors = await validateDTO(this.props.validationClass, d);
                if (_errors.length > 0) {
                    return this.setState({ errors: _errors }, () => {
                        this.handleErrors.bind(this)(_errors);
                        this.forceUpdate()
                    });
                }
            }
            this.props?.onSubmit?.(d)
        });
    }

    override render() {
        const { noFormTag, children } = this.props || {}
        const _children = typeof children === "function" ? children({ ...this.props, value: this.state.data, errors: this.state.errors }) : children
        return (
            <FormProvider value={{
                id: this.props.id || randomId(5),
                data: this.state.data,
                errors: this.state.errors,
                setFieldValue: this.setFieldValue.bind(this),
                registerField: this.registerField.bind(this),
                unregisterField: this.unregisterField.bind(this),
                fields: this.state.fields
            }}>
                {noFormTag ? _children :
                    <form
                        id={this.props?.id}
                        style={{ width: "100%" }}
                        onSubmit={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            this.onSubmit.bind(this)(this.state.data)
                        }
                        }
                    // {...formProps}
                    >
                        {/* <Box>{JSON.stringify(this.state.data)}</Box> */}
                        {_children}
                    </form>}
            </FormProvider >
        )
    }
}

export default {
    Field,
    Form,
    FormControl,
    FormLabel
}