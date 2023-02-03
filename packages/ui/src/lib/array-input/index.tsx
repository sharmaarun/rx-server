import { useDisclosure } from "@chakra-ui/react"
import { RXICO_CHEVRON_DOWN, RXICO_EDIT, RXICO_PLUS, RXICO_TRASH_EMPTY } from "@reactive/icons"
import { useCallback, useEffect, useState } from "react"
import Box from "../box"
import { Button } from "../button"
import { Form, FormProps } from "../form"
import Icon from "../icon"
import ListInput, { ListInputProps } from "../list-input"
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "../modal"
import { HStack } from "../stack"

export interface IArrayInputFormChildrenProps {
    entry: any
}

export interface ArrayInputProps extends ListInputProps, Omit<FormProps, "onSubmit" | "defaultValue" | "children"> {
    onChange?: (value: any[]) => void
    children?: ({ entry }: IArrayInputFormChildrenProps) => any
    formHeader?: ({ onChange, value, isOpen, onOpen, onClose, index }: any) => any;
    formFooter?: ({ onChange, value, isOpen, onOpen, onClose, index }: any) => any;
}

export function ArrayInput({
    onChange,
    value = [],
    children,
    formFooter,
    formHeader,
    validationClass,
    multiple = true,
    ...rest
}: ArrayInputProps) {
    const modal = useDisclosure()
    const [entry, setEntry] = useState<any>();
    const [index, setIndex] = useState<number>(-1);

    useEffect(() => {
        if (!modal.isOpen) {
            setEntry(null)
            setIndex(-1)
        }
    }, [modal.isOpen])

    const save = useCallback((val: any) => {
        let _value = [...(value || [])];
        if (index <= -1) {
            if (multiple) {
                _value.push(val)
            } else {
                _value = [val]
            }
        }
        else if (index >= 0) {
            _value[index] = val
        }
        onChange?.(_value)
        modal.onClose()
    }, [index, entry, value])

    const onEditClick = (item: any, index: number = -1) => {
        if (index >= 0) {
            setEntry(item);
            setIndex(index ?? -1);
            modal.onOpen()
        }
    }

    const removeAll = () => onChange?.([])

    return (<>
        <Modal
            {...modal}
        >
            <ModalOverlay></ModalOverlay>
            <ModalContent>
                <ModalCloseButton />
                <Form value={entry}  validationClass={validationClass} onChange={setEntry} onSubmit={save}>
                    <>
                        {formHeader && <ModalHeader>
                            {formHeader({ index, onChange, value, ...modal })}
                        </ModalHeader>}
                        <ModalBody>
                            {children?.({ entry })}
                        </ModalBody>
                        {formFooter && <ModalFooter>
                            {formFooter({ index, onChange, value, ...modal })}
                        </ModalFooter>}
                    </>
                </Form>
            </ModalContent>
        </Modal>
        <Box
            pos="relative"
        >
            <Box
                pos="absolute"
                top={"-32px"}
                right="0"
            >
                <HStack
                    justifyContent="flex-end"
                    pr={2}
                    spacing={4}
                >
                    <Button
                        onClick={() => modal.onOpen()}
                        iconSpacing={1}
                        leftIcon={
                            <Icon>
                                {multiple ? <RXICO_PLUS /> : <RXICO_EDIT />}
                            </Icon>
                        } variant="link">
                        {/* {multiple ? t("Add") : t("Edit")} */}
                    </Button>
                    {value?.length > 0 && <Button
                        iconSpacing={1}
                        colorScheme="red"
                        onClick={() => removeAll()}
                        leftIcon={
                            <Icon>
                                <RXICO_TRASH_EMPTY />
                            </Icon>
                        } variant="link">
                        Remove All
                    </Button>
                    }
                </HStack>
            </Box>
            <ListInput
                {...rest}
                multiple
                onChange={onChange}
                value={value}
                onEditClick={onEditClick}
            />
        </Box>
    </>
    )
}

export default ArrayInput