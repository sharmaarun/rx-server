import { registerAttributeType, RegisteredAttribute, Route as IRoute } from "@reactive/client"
import { BaseAttributeType, RelationType, StringAttributeSubType } from "@reactive/commons"
import { RXICO_CALENDAR, RXICO_FIELD_BOOLEAN, RXICO_FIELD_ENUM, RXICO_FIELD_JSON, RXICO_FIELD_NUMBER, RXICO_FIELD_RELATION, RXICO_FIELD_RICH_TEXT, RXICO_FIELD_STRING, RXICO_FIELD_UUID, RXICO_RELATION_HAS_MANY, RXICO_RELATION_HAS_ONE, RXICO_RELATION_MANY_TO_MANY, RXICO_RELATION_MANY_TO_ONE, RXICO_RELATION_ONE_TO_MANY, RXICO_RELATION_ONE_TO_ONE } from "@reactive/icons"
import { Input } from "@reactive/ui"
import { Route } from "react-router-dom"
import { DateTypeEditor, EnumTypeEditor, NumberTypeEditor, RelationsTypeEditor, StringTypeEditor } from "../components/type-editors"
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

const attributeTypes: RegisteredAttribute[] = [
    {
        attribute: {
            type: BaseAttributeType.string,
            customType: "string",
        },
        metadata: {
            components: {
                valueEditor: Input,
                valueRenderer: Input,
                typeEditor: StringTypeEditor
            },
            icon: () => <RXICO_FIELD_STRING />
        }
    },
    {
        attribute: {
            type: BaseAttributeType.number,
            customType: "number",
        },
        metadata: {
            components: {
                valueEditor: Input,
                valueRenderer: Input,
                typeEditor: NumberTypeEditor
            },
            icon: () => <RXICO_FIELD_NUMBER />
        }
    },
    {
        attribute: {
            type: BaseAttributeType.string,
            customType: "rich-text",
            subType: StringAttributeSubType.text
        },
        metadata: {
            components: {
                valueEditor: Input,
                valueRenderer: Input,
            },
            icon: () => <RXICO_FIELD_RICH_TEXT />
        }
    },
    {
        attribute: {
            type: BaseAttributeType.boolean,
            customType: "boolean",
        },
        metadata: {
            components: {
                valueEditor: Input,
                valueRenderer: Input,
            },
            icon: () => <RXICO_FIELD_BOOLEAN />
        }
    },
    {
        attribute: {
            type: BaseAttributeType.date,
            customType: "date",
        },
        metadata: {
            components: {
                valueEditor: Input,
                valueRenderer: Input,
                typeEditor: DateTypeEditor
            },
            icon: () => <RXICO_CALENDAR />
        }
    },
    {
        attribute: {
            type: BaseAttributeType.enum,
            customType: "enum",
        },
        metadata: {
            components: {
                valueEditor: Input,
                valueRenderer: Input,
                typeEditor: EnumTypeEditor
            },
            icon: () => <RXICO_FIELD_ENUM />
        }
    },
    {
        attribute: {
            type: BaseAttributeType.json,
            customType: "json",
        },
        metadata: {
            components: {
                valueEditor: Input,
                valueRenderer: Input,
            },
            icon: () => <RXICO_FIELD_JSON />
        }
    },
    {
        attribute: {
            type: BaseAttributeType.relation,
            customType: "relation",
        },
        metadata: {
            components: {
                valueEditor: Input,
                valueRenderer: Input,
                typeEditor: RelationsTypeEditor
            },
            icon: () => <RXICO_FIELD_RELATION />
        }
    },
    {
        attribute: {
            type: BaseAttributeType.uuid,
            customType: "uuid",
        },
        metadata: {
            components: {
                valueEditor: Input,
                valueRenderer: Input,
            },
            icon: () => <RXICO_FIELD_UUID />
        }
    }
]




export const RelationTypes = {
    [RelationType.ONE_TO_ONE]: {
        icon: <RXICO_RELATION_ONE_TO_ONE />,
        title: "One To One"
    },
    [RelationType.ONE_TO_MANY]: {
        icon: <RXICO_RELATION_ONE_TO_MANY />,
        title: "One To Many"
    },
    [RelationType.MANY_TO_ONE]: {
        icon: <RXICO_RELATION_MANY_TO_ONE />,
        title: "Many To One"
    },
    [RelationType.MANY_TO_MANY]: {
        icon: <RXICO_RELATION_MANY_TO_MANY />,
        title: "Many To Many"
    },
    [RelationType.HAS_ONE]: {
        icon: <RXICO_RELATION_HAS_ONE />,
        title: "Has One"
    },
    [RelationType.HAS_MANY]: {
        icon: <RXICO_RELATION_HAS_MANY />,
        title: "Has Many"
    },
}

export const registerCoreAttributeTypes = () => {
    attributeTypes.forEach((t) => {
        registerAttributeType(ctx => (t))
    })
}