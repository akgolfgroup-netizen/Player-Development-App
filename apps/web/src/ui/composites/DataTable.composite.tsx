import React from 'react';

/**
 * DataTable Composite
 * Feature-rich data table with sorting, selection, and responsive design
 */

interface Column<T> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  /** Table columns */
  columns: Column<T>[];
  /** Table data */
  data: T[];
  /** Row key accessor */
  getRowId: (row: T) => string;
  /** Enable row selection */
  selectable?: boolean;
  /** Selected row IDs */
  selectedRows?: string[];
  /** Selection change handler */
  onSelectionChange?: (selectedIds: string[]) => void;
  /** Row click handler */
  onRowClick?: (row: T) => void;
  /** Loading state */
  loading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Compact mode */
  compact?: boolean;
  /** Striped rows */
  striped?: boolean;
  /** Hover effect */
  hoverable?: boolean;
}

function DataTable<T extends Record<string, any>>({
  columns,
  data,
  getRowId,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
  compact = false,
  striped = false,
  hoverable = true,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const handleSort = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column?.sortable) return;

    if (sortColumn === columnId) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = () => {
    if (!onSelectionChange) return;

    if (selectedRows.length === data.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(data.map((row) => getRowId(row)));
    }
  };

  const handleSelectRow = (rowId: string) => {
    if (!onSelectionChange) return;

    if (selectedRows.includes(rowId)) {
      onSelectionChange(selectedRows.filter((id) => id !== rowId));
    } else {
      onSelectionChange([...selectedRows, rowId]);
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data;

    const column = columns.find((col) => col.id === sortColumn);
    if (!column) return data;

    return [...data].sort((a, b) => {
      const aValue = typeof column.accessor === 'function'
        ? column.accessor(a)
        : a[column.accessor];
      const bValue = typeof column.accessor === 'function'
        ? column.accessor(b)
        : b[column.accessor];

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection, columns]);

  const getCellValue = (row: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    return row[column.accessor];
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}>Loading...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <p style={styles.emptyMessage}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          {/* Header */}
          <thead style={styles.thead}>
            <tr>
              {selectable && (
                <th style={{ ...styles.th, width: '48px' }}>
                  <input
                    type="checkbox"
                    checked={selectedRows.length === data.length}
                    onChange={handleSelectAll}
                    style={styles.checkbox}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.id}
                  style={{
                    ...styles.th,
                    ...(compact && styles.thCompact),
                    width: column.width,
                    textAlign: column.align || 'left',
                    ...(column.sortable && styles.thSortable),
                  }}
                  onClick={() => column.sortable && handleSort(column.id)}
                >
                  <div style={styles.thContent}>
                    <span>{column.header}</span>
                    {column.sortable && (
                      <span style={styles.sortIcon}>
                        {sortColumn === column.id ? (
                          sortDirection === 'asc' ? '↑' : '↓'
                        ) : (
                          '↕'
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody style={styles.tbody}>
            {sortedData.map((row, rowIndex) => {
              const rowId = getRowId(row);
              const isSelected = selectedRows.includes(rowId);

              return (
                <tr
                  key={rowId}
                  style={{
                    ...styles.tr,
                    ...(striped && rowIndex % 2 === 1 && styles.trStriped),
                    ...(hoverable && styles.trHoverable),
                    ...(onRowClick && styles.trClickable),
                    ...(isSelected && styles.trSelected),
                  }}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <td style={styles.td}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(rowId)}
                        onClick={(e) => e.stopPropagation()}
                        style={styles.checkbox}
                        aria-label={`Select row ${rowIndex + 1}`}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      style={{
                        ...styles.td,
                        ...(compact && styles.tdCompact),
                        textAlign: column.align || 'left',
                      }}
                    >
                      {getCellValue(row, column)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
    backgroundColor: 'var(--background-white)',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 'var(--font-size-body)',
  },
  thead: {
    backgroundColor: 'var(--gray-100)',
    borderBottom: '2px solid var(--border-default)',
  },
  th: {
    padding: 'var(--spacing-3) var(--spacing-4)',
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    whiteSpace: 'nowrap',
  },
  thCompact: {
    padding: 'var(--spacing-2) var(--spacing-3)',
  },
  thSortable: {
    cursor: 'pointer',
    userSelect: 'none',
  },
  thContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
  },
  sortIcon: {
    color: 'var(--text-tertiary)',
    fontSize: '12px',
  },
  tbody: {},
  tr: {
    borderBottom: '1px solid var(--border-subtle)',
  },
  trStriped: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  trHoverable: {
    transition: 'background-color 0.15s ease',
  },
  trClickable: {
    cursor: 'pointer',
  },
  trSelected: {
    backgroundColor: 'rgba(16, 69, 106, 0.05)',
  },
  td: {
    padding: 'var(--spacing-3) var(--spacing-4)',
    color: 'var(--text-primary)',
  },
  tdCompact: {
    padding: 'var(--spacing-2) var(--spacing-3)',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-10)',
    backgroundColor: 'var(--background-white)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
  },
  spinner: {
    color: 'var(--text-secondary)',
  },
  emptyContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-10)',
    backgroundColor: 'var(--background-white)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
  },
  emptyMessage: {
    color: 'var(--text-secondary)',
    fontSize: 'var(--font-size-body)',
    margin: 0,
  },
};

export default DataTable;
