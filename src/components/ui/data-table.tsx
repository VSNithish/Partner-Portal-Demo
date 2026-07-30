import { ArrowDown } from "lucide-react";
import type { ReactNode } from "react";

type DataTableColumn<Row> = {
  key: keyof Row;
  label: string;
  renderCell?: (row: Row) => ReactNode;
  sortable?: boolean;
};

type DataTableProps<Row> = {
  columns: Array<DataTableColumn<Row>>;
  emptyMessage: string;
  rows: Row[];
  sortKey: keyof Row | null;
  onSort: (key: keyof Row) => void;
};

export const DataTable = <Row extends Record<string, unknown>>({
  columns,
  emptyMessage,
  rows,
  sortKey,
  onSort,
}: DataTableProps<Row>) => (
  <div className="customers-table-scroll">
    <table className="customers-table">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={String(column.key)}>
              <button
                className={`customers-th-button${sortKey === column.key ? " is-active" : ""}${column.sortable ? " is-sortable" : ""}`}
                onClick={() => {
                  if (!column.sortable) return;
                  onSort(column.key);
                }}
                type="button"
              >
                <span>{column.label}</span>
                {column.sortable ? <ArrowDown size={14} strokeWidth={1.8} /> : null}
              </button>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td key={String(column.key)}>
                {column.renderCell ? column.renderCell(row) : String(row[column.key] ?? "")}
              </td>
            ))}
          </tr>
        ))}
        {rows.length === 0 ? (
          <tr>
            <td className="customers-empty-state" colSpan={columns.length}>
              {emptyMessage}
            </td>
          </tr>
        ) : null}
      </tbody>
    </table>
  </div>
);
