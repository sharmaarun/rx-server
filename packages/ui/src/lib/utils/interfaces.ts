export interface Option {
    label?: string;
    value?: any;
}
export interface BaseItem extends Option {
    label: string;
    value?: any;
    defaultValue?: any;
    icon?: any;
}
export interface Item extends BaseItem {
    id: string | number;
}

export interface ItemWihoutID extends BaseItem { }

export interface ListItem extends Item {
    isDivider?: boolean;
    link?: string;
    items?: ListItem[];
    helpText?: string;
    onClick?: (item: ListItem,index?:number) => void
}

export interface OptionsMenuOption extends Item {
    isDivider?: boolean;
    items?: OptionsMenuOption[];
    type?: "checkbox" | "radio";
    onClick?: (item: OptionsMenuOption) => void
    onChange?: (value: string | string[]) => void
}