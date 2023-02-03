import Table, { AutoResizer, BaseTableProps } from "react-base-table"
import "react-base-table/styles.css"
export type { ColumnShape } from "react-base-table"
interface Props extends BaseTableProps {

}
export function RBTable({ ...props }: Props) {
    return (

        <AutoResizer >
            {({ width, height }) => (
                <Table fixed {...props} width={width} height={height} />
            )}
        </AutoResizer>
    )
}

export default RBTable