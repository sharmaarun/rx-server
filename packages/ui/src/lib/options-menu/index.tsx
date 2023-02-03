import { MenuListProps } from '@chakra-ui/react'
import { createContext, forwardRef, useContext } from 'react'
import { Menu, MenuButton, MenuButtonProps, MenuItemOption, MenuItemOptionProps, MenuList, MenuOptionGroup, MenuOptionGroupProps, MenuProps } from '../menu'
import Portal from '../portal'

export interface OptionsMenuProps extends MenuProps {
}

export function OptionsMenu({ children, ...props }: OptionsMenuProps) {
    return (
        <Menu closeOnSelect={false} {...props}>
            {children}
        </Menu>
    )
}

export const OptionsMenuTrigger = forwardRef(({ children, ...props }: MenuButtonProps, ref: any) => {
    return <MenuButton {...props} ref={ref}>
        {children}
    </MenuButton >
})
export type OptionsMenuContextOpts = {
    onChange?: (value: string | string[]) => void
    value?: string | string[]
}
export const OptionsMenuContext = createContext<OptionsMenuContextOpts>({});
export const OptionsMenuList = ({
    children,
    defaultValue,
    onChange,
    value,
    type,
    ...props
}: MenuListProps & MenuOptionGroupProps) => {

    return <Portal>
        <OptionsMenuContext.Provider value={{ onChange, value }}>
            <MenuList shadow="2xl" minWidth='150px' {...props}>
                {children}
            </MenuList>
        </OptionsMenuContext.Provider>
    </Portal >
}

export const OptionsMenuGroup = ({ children, ...props }: MenuOptionGroupProps) => {
    return <MenuOptionGroup {...props}>
        {children}
    </MenuOptionGroup>
}

export const OptionsMenuItem = ({ value, children }: MenuItemOptionProps) => {
    const { onChange, value: val } = useContext(OptionsMenuContext);
    return <MenuItemOption
        isChecked={JSON.stringify(val) === JSON.stringify(value)}
        onClick={() => value && onChange?.(value)}>
        {children}
    </MenuItemOption>
}

export default OptionsMenu