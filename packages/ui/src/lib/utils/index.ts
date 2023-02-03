import { extendTheme, theme, withDefaultColorScheme } from "@chakra-ui/react"

const colors = {
    brand: {
        50: theme.colors.gray[50],
        // 50: "#F6F6F7",
        100: theme.colors.gray[100],
        200: theme.colors.gray[200],
        300: "#99c8ff",
        400: "#4d9eff",
        500: "#0075ff",
        600: "#0069e6",
        700: "#0052b3",
        800: "#003b80",
        900: "#00234c",
    },
    textalpha: theme.colors.blackAlpha[700],
    textdarkalpha: theme.colors.blackAlpha[500],
    textdarkdisabled: theme.colors.blackAlpha[300],
    textdark: theme.colors.blackAlpha[700],
    text: theme.colors.black,
    textlightalpha: theme.colors.whiteAlpha[800],
    textlightdisabled: theme.colors.whiteAlpha[300],
    textlight: theme.colors.whiteAlpha[900],
    bgalpha: theme.colors.blackAlpha[200],
    bglight: theme.colors.whiteAlpha[900],
    borderdark: theme.colors.blackAlpha[400],
    borderlight: theme.colors.blackAlpha[200],
    card: theme.colors.white,
    input: theme.colors.white,
    tableheader: theme.colors.gray[50],
    tablerowhover: theme.colors.gray[50],
    inputborder: theme.colors.blackAlpha[200],
    inputborderhover: theme.colors.blackAlpha[300]
}

const components = {

}

const styles = {
    global: () => ({
        "html, body": {
            fontSize: "sm"
        },
        ".BaseTable": {
            fontSize: "md"
        },
        ".BaseTable__header-row": {
            backgroundColor: "tableheader",
            borderBottom: "1px solid",
            borderBottomColor: "borderlight"
        },
        ".BaseTable__table-frozen-left": {
            boxShadow: "none",
            borderRight: "1px solid",
            borderRightColor: "borderlight"
        },
        ".entity-list-edit-menu": {
            visibility: "hidden"
        },
        ".BaseTable__row:hover .entity-list-edit-menu": {
            visibility: "visible"
        },
        ".BaseTable__table-frozen-right": {
            boxShadow: "none",
            // borderLeft: "1px solid",
            // borderLeftColor: "borderlight"
        },
        ".BaseTable__row:hover": {
            backgroundColor: "tablerowhover"
        },
        ".BaseTable__row--hovered": {
            backgroundColor: "tablerowhover"
        },
        "h1": {
            fontSize: "6xl",
            fontWeight: "bold"
        },
        "h2": {
            fontSize: "4xl",
            fontWeight: "bold"
        },
        "h3": {
            fontSize: "2xl",
            fontWeight: "semibold"
        },
        "h4": {
            fontSize: "xl",
            fontWeight: "medium"
        },
        "h5": {
            fontSize: "lg",
            fontWeight: "normal"
        },
        "h6": {
            fontSize: "md",
            fontWeight: "normal"
        }
    })
}

const _theme = {
    colors,
    components,
    styles
}
export const DefaultTheme = extendTheme(
    _theme,
    withDefaultColorScheme({ colorScheme: "brand" }),
) as typeof _theme;

export * from "./hooks"
export * from "./interfaces"

