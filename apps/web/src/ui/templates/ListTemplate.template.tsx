import React from 'react';
import { AppShell, PageHeader } from '../raw-blocks';
import { Button, Input, Badge, Text } from '../primitives';
import { DataTable, Pagination, Dropdown, Modal } from '../composites';

/**
 * ListTemplate
 * List view template with filters, search, sorting, and pagination
 */

interface FilterOption {
  id: string;
  label: string;
  value: string;
}

interface ListTemplateProps<T> {
  /** Page title */
  title: string;
  /** Page subtitle */
  subtitle?: string;
  /** Table columns */
  columns: any[];
  /** Table data */
  data: T[];
  /** Get unique row ID */
  getRowId: (row: T) => string;
  /** Create button label */
  createLabel?: string;
  /** Create button handler */
  onCreate?: () => void;
  /** Row click handler */
  onRowClick?: (row: T) => void;
  /** Search handler */
  onSearch?: (query: string) => void;
  /** Filter options */
  filters?: FilterOption[];
  /** Active filter */
  activeFilter?: string;
  /** Filter change handler */
  onFilterChange?: (filterId: string) => void;
  /** Enable row selection */
  selectable?: boolean;
  /** Selected rows */
  selectedRows?: string[];
  /** Selection change handler */
  onSelectionChange?: (ids: string[]) => void;
  /** Bulk actions */
  bulkActions?: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
    onClick: (selectedIds: string[]) => void;
    danger?: boolean;
  }>;
  /** Pagination */
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  /** Loading state */
  loading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Total count */
  totalCount?: number;
}

function ListTemplate<T extends Record<string, any>>({
  title,
  subtitle,
  columns,
  data,
  getRowId,
  createLabel = 'Create New',
  onCreate,
  onRowClick,
  onSearch,
  filters,
  activeFilter,
  onFilterChange,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  bulkActions,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  loading = false,
  emptyMessage = 'No items found',
  totalCount,
}: ListTemplateProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleBulkAction = (actionId: string) => {
    const action = bulkActions?.find((a) => a.id === actionId);
    if (action) {
      action.onClick(selectedRows);
    }
  };

  const hasSelection = selectedRows.length > 0;

  return (
    <AppShell
      header={
        <PageHeader
          title={title}
          subtitle={subtitle}
          actions={
            onCreate && (
              <Button variant="primary" onClick={onCreate}>
                {createLabel}
              </Button>
            )
          }
        />
      }
    >
      <div style={styles.container}>
        {/* Toolbar */}
        <div style={styles.toolbar}>
          {/* Search */}
          {onSearch && (
            <div style={styles.searchContainer}>
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearch}
                leftAddon={
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                    <circle cx="8" cy="8" r="6" strokeWidth="2" />
                    <path d="M12 12l5 5" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                }
              />
            </div>
          )}

          {/* Filters */}
          {filters && filters.length > 0 && (
            <div style={styles.filters}>
              {filters.map((filter) => (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => onFilterChange?.(filter.id)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          )}

          {/* Bulk Actions */}
          {hasSelection && bulkActions && bulkActions.length > 0 && (
            <div style={styles.bulkActions}>
              <Badge variant="primary" pill>
                {selectedRows.length} selected
              </Badge>
              <Dropdown
                trigger={
                  <Button variant="ghost" size="sm">
                    Actions
                  </Button>
                }
                items={bulkActions.map((action) => ({
                  id: action.id,
                  label: action.label,
                  icon: action.icon,
                  danger: action.danger,
                  onClick: () => handleBulkAction(action.id),
                }))}
              />
            </div>
          )}

          {/* Count */}
          {totalCount !== undefined && (
            <div style={styles.count}>
              <Text variant="footnote" color="secondary">
                {totalCount} {totalCount === 1 ? 'item' : 'items'}
              </Text>
            </div>
          )}
        </div>

        {/* Table */}
        <div style={styles.tableContainer}>
          <DataTable
            columns={columns}
            data={data}
            getRowId={getRowId}
            selectable={selectable}
            selectedRows={selectedRows}
            onSelectionChange={onSelectionChange}
            onRowClick={onRowClick}
            loading={loading}
            emptyMessage={emptyMessage}
            striped
            hoverable
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && onPageChange && (
          <div style={styles.paginationContainer}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              showFirstLast
              showPrevNext
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Deletion"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                // Handle delete
                setDeleteModalOpen(false);
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        <Text>
          Are you sure you want to delete {selectedRows.length}{' '}
          {selectedRows.length === 1 ? 'item' : 'items'}? This action cannot be undone.
        </Text>
      </Modal>
    </AppShell>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-4)',
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    flexWrap: 'wrap',
    backgroundColor: 'var(--background-white)',
    padding: 'var(--spacing-4)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-card)',
  },
  searchContainer: {
    flex: 1,
    minWidth: '200px',
    maxWidth: '400px',
  },
  filters: {
    display: 'flex',
    gap: 'var(--spacing-2)',
    flexWrap: 'wrap',
  },
  bulkActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    marginLeft: 'auto',
  },
  count: {
    marginLeft: 'auto',
  },
  tableContainer: {
    width: '100%',
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: 'var(--spacing-4) 0',
  },
};

export default ListTemplate;
