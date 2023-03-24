import { DndProvider, DndProviderProps, DragSourceHookSpec, DropTargetHookSpec, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

export type DNDProviderProps = Partial<DndProviderProps<any, any>> & {
    children?: any
}

export function DNDProvider({ children, ...props }: DNDProviderProps) {
    return (
        <DndProvider backend={HTML5Backend} {...props}>
            {children}
        </DndProvider>
    )
}

export type DragProps = DragSourceHookSpec<any, any, any> & {
    ref?: any
    preview?: any
}

export type DraggableProps = DragSourceHookSpec<any, any, any> & {
    children: (props: DragProps) => any
}

export function Draggable({ children, ...props }: DraggableProps) {
    const [obj, ref, preview] = useDrag(props)

    return (
        children({ ref, preview, ...props })
    )
}
export type DropProps = DropTargetHookSpec<any, any, any> & {
    ref?: any
}

export type DroppableProps = DropTargetHookSpec<any, any, any> & {
    children: (props: DropProps) => any
}

export function Droppable({ children, ...props }: DroppableProps) {
    const [obj, ref] = useDrop(props)

    return (
        children({ ref, ...props })
    )
}


