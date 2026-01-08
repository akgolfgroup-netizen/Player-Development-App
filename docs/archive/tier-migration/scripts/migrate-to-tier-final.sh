#!/bin/bash

# Final migration - All remaining ak-* tokens
# Handles focus rings, gradients, and all edge cases

FEATURES_DIR="/Users/anderskristiansen/Developer/IUP_Master_V1/apps/web/src/features"

echo "Starting Final Migration: All remaining ak-* tokens..."
echo "=========================================="

find "$FEATURES_DIR" -type f \( -name "*.tsx" -o -name "*.jsx" \) | while read file; do
  if grep -q "ak-" "$file"; then
    echo "Processing: $file"

    # Replace all variants of primary/success/warning/error
    sed -i '' \
      -e 's/ring-ak-primary/ring-tier-navy/g' \
      -e 's/from-ak-primary/from-tier-navy/g' \
      -e 's/to-ak-primary/to-tier-navy/g' \
      -e 's/outline-ak-primary/outline-tier-navy/g' \
      -e 's/focus:border-ak-primary/focus:border-tier-navy/g' \
      -e 's/hover:bg-ak-primary/hover:bg-tier-navy/g' \
      -e 's/hover:text-ak-primary/hover:text-tier-navy/g' \
      -e 's/ring-ak-success/ring-tier-success/g' \
      -e 's/from-ak-success/from-tier-success/g' \
      -e 's/to-ak-success/to-tier-success/g' \
      -e 's/ring-ak-warning/ring-tier-warning/g' \
      -e 's/from-ak-warning/from-tier-warning/g' \
      -e 's/to-ak-warning/to-tier-warning/g' \
      -e 's/ring-ak-error/ring-tier-error/g' \
      -e 's/from-ak-error/from-tier-error/g' \
      -e 's/to-ak-error/to-tier-error/g' \
      "$file"

    # Replace remaining standalone ak- tokens if they exist
    sed -i '' \
      -e 's/\([^a-zA-Z-]\)ak-primary/\1tier-navy/g' \
      -e 's/\([^a-zA-Z-]\)ak-success/\1tier-success/g' \
      -e 's/\([^a-zA-Z-]\)ak-warning/\1tier-warning/g' \
      -e 's/\([^a-zA-Z-]\)ak-error/\1tier-error/g' \
      -e 's/\([^a-zA-Z-]\)ak-text-primary/\1tier-navy/g' \
      -e 's/\([^a-zA-Z-]\)ak-text-secondary/\1tier-text-secondary/g' \
      -e 's/\([^a-zA-Z-]\)ak-text-tertiary/\1tier-text-tertiary/g' \
      -e 's/\([^a-zA-Z-]\)ak-surface-base/\1tier-white/g' \
      -e 's/\([^a-zA-Z-]\)ak-surface-subtle/\1tier-surface-base/g' \
      -e 's/\([^a-zA-Z-]\)ak-border-default/\1tier-border-default/g' \
      "$file"
  fi
done

echo "=========================================="
echo "Final Migration complete!"

# Count remaining
remaining=$(find "$FEATURES_DIR" -type f \( -name "*.tsx" -o -name "*.jsx" \) -exec grep -l "ak-" {} \; 2>/dev/null | wc -l)
echo "Files with remaining ak-* tokens: $remaining"

# Show what's left
if [ "$remaining" -gt 0 ]; then
  echo ""
  echo "Remaining tokens (top 30):"
  find "$FEATURES_DIR" -type f \( -name "*.tsx" -o -name "*.jsx" \) -exec grep -oh "\bak-[a-zA-Z-]*" {} \; 2>/dev/null | sort | uniq -c | sort -rn | head -30
fi
