import React from 'react';

/**
 * Pagination Composite
 * Pagination controls with keyboard navigation
 */

interface PaginationProps {
  /** Current page (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Page change handler */
  onPageChange: (page: number) => void;
  /** Number of page buttons to show */
  siblingCount?: number;
  /** Show first/last buttons */
  showFirstLast?: boolean;
  /** Show previous/next buttons */
  showPrevNext?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  showPrevNext = true,
  disabled = false,
  size = 'md',
}) => {
  const generatePageNumbers = (): (number | string)[] => {
    const totalNumbers = siblingCount * 2 + 3; // siblings + current + first + last
    const totalBlocks = totalNumbers + 2; // + 2 ellipsis

    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, '...', totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [1, '...', ...rightRange];
    }

    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    );
    return [1, '...', ...middleRange, '...', totalPages];
  };

  const pageNumbers = generatePageNumbers();

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'string' || disabled) return;
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1 && !disabled) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && !disabled) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFirst = () => {
    if (currentPage !== 1 && !disabled) {
      onPageChange(1);
    }
  };

  const handleLast = () => {
    if (currentPage !== totalPages && !disabled) {
      onPageChange(totalPages);
    }
  };

  const buttonStyle = styles.sizes[size];

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      style={styles.container}
    >
      {/* First Button */}
      {showFirstLast && (
        <button
          onClick={handleFirst}
          disabled={disabled || currentPage === 1}
          aria-label="Go to first page"
          style={{
            ...styles.button,
            ...buttonStyle,
            ...(disabled || currentPage === 1 ? styles.buttonDisabled : {}),
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 3L6 8l5 5M6 3L1 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Previous Button */}
      {showPrevNext && (
        <button
          onClick={handlePrevious}
          disabled={disabled || currentPage === 1}
          aria-label="Go to previous page"
          style={{
            ...styles.button,
            ...buttonStyle,
            ...(disabled || currentPage === 1 ? styles.buttonDisabled : {}),
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return (
            <span
              key={`ellipsis-${index}`}
              style={{
                ...styles.ellipsis,
                ...buttonStyle,
              }}
            >
              ...
            </span>
          );
        }

        const pageNumber = page as number;
        const isActive = pageNumber === currentPage;

        return (
          <button
            key={pageNumber}
            onClick={() => handlePageClick(pageNumber)}
            disabled={disabled}
            aria-label={`Go to page ${pageNumber}`}
            aria-current={isActive ? 'page' : undefined}
            style={{
              ...styles.button,
              ...buttonStyle,
              ...(isActive && styles.buttonActive),
              ...(disabled && styles.buttonDisabled),
            }}
          >
            {pageNumber}
          </button>
        );
      })}

      {/* Next Button */}
      {showPrevNext && (
        <button
          onClick={handleNext}
          disabled={disabled || currentPage === totalPages}
          aria-label="Go to next page"
          style={{
            ...styles.button,
            ...buttonStyle,
            ...(disabled || currentPage === totalPages ? styles.buttonDisabled : {}),
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Last Button */}
      {showFirstLast && (
        <button
          onClick={handleLast}
          disabled={disabled || currentPage === totalPages}
          aria-label="Go to last page"
          style={{
            ...styles.button,
            ...buttonStyle,
            ...(disabled || currentPage === totalPages ? styles.buttonDisabled : {}),
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 3l5 5-5 5M10 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </nav>
  );
};

const styles: Record<string, React.CSSProperties | Record<string, React.CSSProperties>> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    justifyContent: 'center',
  } as React.CSSProperties,
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-family)',
    fontWeight: 500,
    color: 'var(--text-primary)',
    backgroundColor: 'var(--background-white)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  } as React.CSSProperties,
  buttonActive: {
    backgroundColor: 'var(--accent)',
    borderColor: 'var(--accent)',
    color: 'var(--text-inverse)',
  } as React.CSSProperties,
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    pointerEvents: 'none',
  } as React.CSSProperties,
  ellipsis: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-secondary)',
  } as React.CSSProperties,
  sizes: {
    sm: {
      minWidth: '32px',
      height: '32px',
      fontSize: 'var(--font-size-footnote)',
      padding: '0 var(--spacing-2)',
    },
    md: {
      minWidth: '40px',
      height: '40px',
      fontSize: 'var(--font-size-body)',
      padding: '0 var(--spacing-3)',
    },
    lg: {
      minWidth: '48px',
      height: '48px',
      fontSize: 'var(--font-size-headline)',
      padding: '0 var(--spacing-4)',
    },
  },
};

export default Pagination;
