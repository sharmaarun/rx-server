import { proxy, useSnapshot } from "valtio";
import { RegisteredField } from "../../fields";

export type FieldsContext = {
    fields: RegisteredField[]
}

export const FieldsContext = proxy<FieldsContext>({
    fields: []
})

export const useFields = () => useSnapshot(FieldsContext)