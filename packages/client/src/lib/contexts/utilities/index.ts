import { proxy, useSnapshot } from "valtio"

export type DeleteAlertModalContext = {
    isOpen: boolean
    onClose: () => void
    onSubmit?: () => void
}

export type UtilitiesContext = {
    deleteAlertModal: DeleteAlertModalContext
}


export const UtilitiesContext:UtilitiesContext = proxy<UtilitiesContext>({
    deleteAlertModal: {
        isOpen: false,
        onClose: () => {
            UtilitiesContext.deleteAlertModal.onSubmit = undefined
            UtilitiesContext.deleteAlertModal.isOpen = false
        }
    }
})

export const useUtilitiesContext = () => useSnapshot(UtilitiesContext)
