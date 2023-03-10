import { registerAttributeType, RegisteredAttribute } from "@reactive/client"
import { BaseAttributeType, RelationType, StringAttributeSubType } from "@reactive/commons"
import { RXICO_CALENDAR, RXICO_FIELD_BOOLEAN, RXICO_FIELD_ENUM, RXICO_FIELD_JSON, RXICO_FIELD_NUMBER, RXICO_FIELD_RELATION, RXICO_FIELD_RICH_TEXT, RXICO_FIELD_STRING, RXICO_FIELD_UUID, RXICO_RELATION_HAS_MANY, RXICO_RELATION_HAS_ONE, RXICO_RELATION_MANY_TO_MANY, RXICO_RELATION_MANY_TO_ONE, RXICO_RELATION_ONE_TO_MANY, RXICO_RELATION_ONE_TO_ONE } from "@reactive/icons"
import { BooleanAttributeEditor, BooleanValueEditor, BooleanValueRenderer, DateTypeEditor, DateValueEditor, DateValueRenderer, EnumAttributeEditor, EnumValueEditor, EnumValueRenderer, JSONAttributeEditor, JSONValueEditor, JSONValueRenderer, NumberAttributeEditor, NumberValueEditor, NumberValueRenderer, RelationsAttributeEditor, RelationValueEditor, RelationValueRenderer, RichTextAttributeEditor, RichTextValueEditor, RichTextValueRenderer, StringAttributeEditor, StringValueEditor, StringValueRenderer, UUIDAttributeEditor, UUIDValueEditor, UUIDValueRenderer } from "../../components/type-editors"

//======== ATTRIBUTES RELATED

const attributeTypes: RegisteredAttribute[] = [
    {
        attribute: {
            type: BaseAttributeType.string,
            customType: "string",
        },
        metadata: {
            components: {
                valueEditor: {
                    span: 6,
                    component: StringValueEditor
                },
                valueRenderer: StringValueRenderer,
                attributeEditor: StringAttributeEditor
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
                valueEditor: {
                    span: 6,
                    component: NumberValueEditor
                },
                valueRenderer: NumberValueRenderer,
                attributeEditor: NumberAttributeEditor
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
                valueEditor: {
                    span: 12,
                    component: RichTextValueEditor
                },
                valueRenderer: RichTextValueRenderer,
                attributeEditor: RichTextAttributeEditor
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
                valueEditor: {
                    span: 6,
                    component: BooleanValueEditor
                },
                valueRenderer: BooleanValueRenderer,
                attributeEditor: BooleanAttributeEditor,
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
                valueEditor: {
                    span: 6,
                    component: DateValueEditor
                },
                valueRenderer: DateValueRenderer,
                attributeEditor: DateTypeEditor
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
                valueEditor: {
                    span: 6,
                    component: EnumValueEditor
                },
                valueRenderer: EnumValueRenderer,
                attributeEditor: EnumAttributeEditor
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
                valueEditor: {
                    span: 12,
                    component: JSONValueEditor
                },
                valueRenderer: JSONValueRenderer,
                attributeEditor: JSONAttributeEditor
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
                valueEditor: {
                    span: 6,
                    component: RelationValueEditor
                },
                valueRenderer: RelationValueRenderer,
                attributeEditor: RelationsAttributeEditor
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
                valueEditor: {
                    span: 6,
                    component: UUIDValueEditor
                },
                valueRenderer: UUIDValueRenderer,
                attributeEditor: UUIDAttributeEditor
            },
            icon: () => <RXICO_FIELD_UUID />
        }
    }
]


export const RelationTypes = {
    [RelationType.ONE_TO_ONE]: {
        icon: <RXICO_RELATION_ONE_TO_ONE />,
        title: "Has One And Belongs To One"
    },
    [RelationType.ONE_TO_MANY]: {
        icon: <RXICO_RELATION_ONE_TO_MANY />,
        title: "Has Many And Belongs To One"
    },
    [RelationType.MANY_TO_ONE]: {
        icon: <RXICO_RELATION_MANY_TO_ONE />,
        title: "Belongs To Many And Has One"
    },
    [RelationType.MANY_TO_MANY]: {
        icon: <RXICO_RELATION_MANY_TO_MANY />,
        title: "Has Many And Belongs To Many"
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

/**
 * Register basic attribute types
 */
export const registerCoreAttributeTypes = () => {
    attributeTypes.forEach((t) => {
        registerAttributeType(ctx => (t))
    })
}
