import { convertFromRaw, EditorState } from "draft-js"
import { useEffect, useState } from "react"
import { Editor, RawDraftContentState } from "react-draft-wysiwyg"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import { Box, BoxProps } from "../box"

export interface RichTextEditorProps extends Omit<BoxProps, "onChange" | "defaultValue"> {
    children?: any
    onChange?: (value: RawDraftContentState) => void
    defaultValue?: RawDraftContentState
}

export function RichTextEditor({ children, defaultValue, onChange, ...props }: RichTextEditorProps) {
    const [state, setState] = useState(
        defaultValue ?
            EditorState.createWithContent(convertFromRaw(defaultValue)) :
            EditorState.createEmpty()
    )
    const [content, setContent] = useState(defaultValue)

    useEffect(() => {
        if (!content && defaultValue && JSON.stringify(defaultValue) !== JSON.stringify(content)) {
            setContent(defaultValue)
            setState(EditorState.createWithContent(convertFromRaw(defaultValue)))
        }
    }, [defaultValue])

    const onChange_ = (newState: RawDraftContentState) => {
        onChange?.(newState)
        setContent(newState)
    }
    const onEditorChange_ = (newState: EditorState) => {
        setState(newState)
    }
    return (
        <Box {...props}>
            <Editor
                editorState={state}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                editorStyle={{
                    border: "1px solid #eeeeee",
                    borderRadius: "5px",
                    paddingLeft:"10px",
                    paddingRight:"10px",
                }}
                onContentStateChange={onChange_}
                onEditorStateChange={onEditorChange_}
            />
        </Box>
    )
}
