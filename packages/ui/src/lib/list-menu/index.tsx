import Box from "../box";
import { Menu, MenuButton, MenuButtonProps, MenuDivider, MenuItem, MenuItemProps, MenuList, MenuProps } from "../menu";
import Link from "../link";
import Portal from "../portal";
import { ListItem } from "../utils";

export interface ListMenuItemProps extends ListItem {
    children?: any
}

export interface ListMenuProps extends Omit<MenuProps, "children"> {
    items?: ListItem[];
    button?: any;
    buttonProps?: MenuButtonProps
}


export function ListMenu({
    items = [],
    button,
    buttonProps,
    ...props
}: ListMenuProps) {
    return (
        <Menu {...props} >
            <MenuButton {...buttonProps}>
                {button}
            </MenuButton>
            {items?.length > 0 &&
                <Portal>
                    <MenuList shadow="2xl" minWidth={"150px"} zIndex={10}>
                        {items?.map((item, index) => {
                            const Wrapper = item.link?.length ? Link : (({ children }: any) => children)
                            return <Wrapper href={item.link}>
                                {item.isDivider ? <MenuDivider /> :
                                    <MenuItem key={item.id + "-" + index} {...(item as any)}>
                                        {item.label}
                                    </MenuItem>
                                }
                            </Wrapper>
                        }
                        )}
                    </MenuList>
                </Portal>
            }
        </Menu >
    )
}

export default ListMenu