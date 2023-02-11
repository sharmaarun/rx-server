import { registerFieldType, Route as IRoute, RegisteredField } from "@reactive/client"
import { BaseFieldType } from "@reactive/commons"
import { Input, RegisteredFields, Select, Switch, Textarea } from "@reactive/ui"
import { Route } from "react-router-dom"
import { StringTypeEditor, NumberTypeEditor } from "../components/type-editors"
export const buildRouter = (routes?: IRoute[]) => {
    return routes?.map((r, ind) => {
        const Ele = r.element || (() => <></>)
        return <Route
            key={ind}
            path={r.path}
            element={< Ele />}
        >
            {buildRouter(r?.children)}
        </Route >
    })
}

const fieldTypes: RegisteredField[] = [
    {
        field: {
            type: BaseFieldType.string,
            customType: "string",
        },
        metadata: {
            components: {
                valueEditor: Input,
                valueRenderer: Input,
                typeEditor: StringTypeEditor
            },
            icon: <></>
        }
    },
    {
        field: {
            type: BaseFieldType.number,
            customType: "number",
        },
        metadata: {
            components: {
                valueEditor: Input,
                valueRenderer: Input,
                typeEditor: NumberTypeEditor
            },
            icon: <></>
        }
    },
    {
        field: {
            type: BaseFieldType.string,
            customType: "rich-text",
        },
        metadata: {
            components: {
                valueEditor: Input,
                valueRenderer: Input,
            },
            icon: <></>
        }
    },
    {
        field: {
            type: BaseFieldType.boolean,
            customType: "boolean",
        },
        metadata: {
            components: {
                valueEditor: Input,
                valueRenderer: Input,
            },
            icon: <></>
        }
    },
    {
        field: {
            type: BaseFieldType.date,
            customType: "date",
        },
        metadata: {
            components: {
                valueEditor: Input,
                valueRenderer: Input,
            },
            icon: <></>
        }
    },
    {
        field: {
            type: BaseFieldType.enum,
            customType: "enum",
        },
        metadata: {
            components: {
                valueEditor: Input,
                valueRenderer: Input,
            },
            icon: <></>
        }
    },
    {
        field: {
            type: BaseFieldType.json,
            customType: "json",
        },
        metadata: {
            components: {
                valueEditor: Input,
                valueRenderer: Input,
            },
            icon: <></>
        }
    },
    {
        field: {
            type: BaseFieldType.relation,
            customType: "relation",
        },
        metadata: {
            components: {
                valueEditor: Input,
                valueRenderer: Input,
            },
            icon: <></>
        }
    },
    {
        field: {
            type: BaseFieldType.uuid,
            customType: "uuid",
        },
        metadata: {
            components: {
                valueEditor: Input,
                valueRenderer: Input,
            },
            icon: <></>
        }
    }
]


export const registerCoreFieldTypes = () => {
    fieldTypes.forEach((t) => {
        registerFieldType(ctx => (t))
    })
}