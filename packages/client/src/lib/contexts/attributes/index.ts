import { proxy, useSnapshot } from "valtio";
import { RegisteredAttribute } from "../../attributes";

export type AttributesContext = {
    attributes: RegisteredAttribute[]
}

export const AttributesContext = proxy<AttributesContext>({
    attributes: []
})

export const useAttributes = () => useSnapshot(AttributesContext)