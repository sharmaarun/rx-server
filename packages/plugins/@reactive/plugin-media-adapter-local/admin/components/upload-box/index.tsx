import React, { useRef, useState } from "react"
import { ActionButton, Field, FormModal, FormModalProps, HStack, Image, Input, ModalBody, Stack, Text, useFormModal } from "@reactive/ui"
import { Obj } from "@reactive/client"

export interface UploadBoxProps extends Omit<FormModalProps, "children"> {

}
const fileEndpoint = new Obj("file")
export function UploadBox({ ...props }: UploadBoxProps) {
    const ref = useRef<any>()
    const [file, setFile] = useState<File>()
    const [image, setImage] = useState<string>()

    const upload = async (data: any) => {
        const file = document.querySelector<HTMLInputElement>("#FILE_UPLOAD").files?.[0]
        const fileReader = new FileReader()
        fileReader.onload = async event => {
            const formData = new FormData()
            formData.append("type", "image")
            formData.append("file", file)
            const res = await fileEndpoint.call("upload", {
                body: formData,
                method: "POST",
                noDefaultHeaders: true
            })
            props?.onSubmit?.(res)
        }
        fileReader.readAsBinaryString(file)
    }

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e)
        const ufile = e.target.files?.[0]
        console.log(ufile)
        if (ufile) {
            setFile(ufile)
            setImage(URL.createObjectURL(ufile))
        }
    }

    const clearInput = () => {
        setFile(undefined)
        setImage(undefined)
        props?.onClose?.()
    }

    return (
        <FormModal
            {...props}
            onClose={clearInput}
            onSubmit={upload}
            footer={
                file ? <HStack flex={1}>
                    <Text>{file.name}</Text>
                </HStack> : ""
            }
        >
            <ModalBody p={4}>
                {/* <Field name="file"> */}
                <Input
                    ref={ref}
                    h="0"
                    type="file"
                    id="FILE_UPLOAD"
                    visibility="hidden"
                    onInput={onFileChange}
                    accept=".jpg,.jpeg,.png,.svg,.gif"
                />
                {/* </Field> */}
                {image?.length > 0 ? <Image src={image} /> : ""}
                <Stack
                    w="100%"
                    p={4}
                    border="1px dashed"
                    borderRadius={5}
                    borderColor="purple.500"
                    justifyContent="center"
                    alignItems="center"
                    bgColor="purple.50"
                    _hover={{ bgColor: "purple.100" }}
                    cursor="pointer"
                    onClick={() => ref?.current?.click?.()}
                >
                    <Text>Click Here To Upload</Text>
                </Stack>
            </ModalBody>
        </FormModal>
    )
}

export default UploadBox