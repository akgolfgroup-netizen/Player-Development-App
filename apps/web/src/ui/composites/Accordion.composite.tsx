import React from 'react';

/**
 * Accordion Composite
 * Expandable/collapsible sections with animation
 */

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface AccordionProps {
  /** Accordion items */
  items: AccordionItem[];
  /** Allow multiple items open */
  allowMultiple?: boolean;
  /** Default open item IDs */
  defaultOpenItems?: string[];
  /** Controlled open items */
  openItems?: string[];
  /** Change handler */
  onChange?: (openItems: string[]) => void;
  /** Show dividers between items */
  showDividers?: boolean;
  /** Additional className */
  className?: string;
}

const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultOpenItems = [],
  openItems,
  onChange,
  showDividers = true,
  className = '',
}) => {
  const [internalOpenItems, setInternalOpenItems] = React.useState<string[]>(defaultOpenItems);

  const isControlled = openItems !== undefined;
  const currentOpenItems = isControlled ? openItems : internalOpenItems;

  const handleToggle = (itemId: string, disabled?: boolean) => {
    if (disabled) return;

    let newOpenItems: string[];

    if (currentOpenItems.includes(itemId)) {
      newOpenItems = currentOpenItems.filter((id) => id !== itemId);
    } else {
      newOpenItems = allowMultiple
        ? [...currentOpenItems, itemId]
        : [itemId];
    }

    if (!isControlled) {
      setInternalOpenItems(newOpenItems);
    }
    onChange?.(newOpenItems);
  };

  return (
    <div style={styles.container} className={className}>
      {items.map((item, index) => {
        const isOpen = currentOpenItems.includes(item.id);

        return (
          <div key={item.id}>
            {showDividers && index > 0 && <div style={styles.divider} />}

            <AccordionItemComponent
              item={item}
              isOpen={isOpen}
              onToggle={handleToggle}
            />
          </div>
        );
      })}
    </div>
  );
};

const AccordionItemComponent: React.FC<{
  item: AccordionItem;
  isOpen: boolean;
  onToggle: (id: string, disabled?: boolean) => void;
}> = ({ item, isOpen, onToggle }) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState<number | undefined>(undefined);

  React.useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div style={styles.item}>
      {/* Header */}
      <button
        onClick={() => onToggle(item.id, item.disabled)}
        disabled={item.disabled}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${item.id}`}
        style={{
          ...styles.header,
          ...(item.disabled && styles.headerDisabled),
        }}
      >
        {item.icon && <span style={styles.icon}>{item.icon}</span>}
        <span style={styles.title}>{item.title}</span>
        <span
          style={{
            ...styles.chevron,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 8l4 4 4-4" />
          </svg>
        </span>
      </button>

      {/* Content */}
      <div
        id={`accordion-content-${item.id}`}
        ref={contentRef}
        style={{
          ...styles.content,
          height: height !== undefined ? `${height}px` : undefined,
          opacity: isOpen ? 1 : 0,
        }}
        aria-hidden={!isOpen}
      >
        <div style={styles.contentInner}>
          {item.content}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
  },
  item: {
    width: '100%',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border-subtle)',
    margin: 'var(--spacing-2) 0',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    width: '100%',
    padding: 'var(--spacing-4)',
    fontSize: 'var(--font-size-body)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
    textAlign: 'left',
  },
  headerDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    pointerEvents: 'none',
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  title: {
    flex: 1,
  },
  chevron: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: 'var(--text-secondary)',
    transition: 'transform 0.2s ease',
  },
  content: {
    overflow: 'hidden',
    transition: 'height 0.3s ease, opacity 0.3s ease',
  },
  contentInner: {
    padding: '0 var(--spacing-4) var(--spacing-4)',
    fontSize: 'var(--font-size-body)',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
  },
};

export default Accordion;
