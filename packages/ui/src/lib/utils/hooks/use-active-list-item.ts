import React from "react";
import { ListItem } from "../interfaces";

/**
 * This hook returns the active item from the list of specified items,
 * based on the window.location.href value.
 * @param items 
 * @returns active item id
 */
export const useActiveListitem = (
    items: ListItem[]
) => {
    const [active, setActive] = React.useState<string | number>(0)
    React.useEffect(() => {
        const path = window.location.pathname;
        items.forEach((item, index) => {
            if (item?.link?.length && path.startsWith(item?.link)) {
                setActive(item.id)
            }
        })
    }, [items]);
    return { active, setActive }
}