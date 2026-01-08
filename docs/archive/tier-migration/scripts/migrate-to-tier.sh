#!/bin/bash

# Bulk migration script for TIER Golf Design System
# Replaces all ak-* tokens with tier-* tokens across the codebase

FEATURES_DIR="/Users/anderskristiansen/Developer/IUP_Master_V1/apps/web/src/features"

# Color map
echo "Starting TIER Golf Design System migration..."
echo "=========================================="

# Find all .tsx and .jsx files
find "$FEATURES_DIR" -type f \( -name "*.tsx" -o -name "*.jsx" \) | while read file; do
  # Check if file contains ak-* tokens
  if grep -q "ak-" "$file"; then
    echo "Migrating: $file"

    # Perform all replacements
    sed -i '' \
      -e 's/bg-ak-surface-subtle/bg-tier-surface-base/g' \
      -e 's/bg-ak-surface-base/bg-tier-white/g' \
      -e 's/text-ak-text-primary/text-tier-navy/g' \
      -e 's/text-ak-text-secondary/text-tier-text-secondary/g' \
      -e 's/text-ak-text-tertiary/text-tier-text-tertiary/g' \
      -e 's/border-ak-border-default/border-tier-border-default/g' \
      -e 's/bg-ak-primary/bg-tier-navy/g' \
      -e 's/text-ak-primary/text-tier-navy/g' \
      -e 's/border-ak-primary/border-tier-navy/g' \
      -e 's/border-l-ak-primary/border-l-tier-navy/g' \
      -e 's/border-t-ak-primary/border-t-tier-navy/g' \
      -e 's/border-b-ak-primary/border-b-tier-navy/g' \
      -e 's/border-r-ak-primary/border-r-tier-navy/g' \
      -e 's/bg-ak-status-success/bg-tier-success/g' \
      -e 's/text-ak-status-success/text-tier-success/g' \
      -e 's/border-ak-status-success/border-tier-success/g' \
      -e 's/bg-ak-status-warning/bg-tier-warning/g' \
      -e 's/text-ak-status-warning/text-tier-warning/g' \
      -e 's/border-ak-status-warning/border-tier-warning/g' \
      -e 's/border-l-ak-status-warning/border-l-tier-warning/g' \
      -e 's/bg-ak-status-error/bg-tier-error/g' \
      -e 's/text-ak-status-error/text-tier-error/g' \
      -e 's/border-ak-status-error/border-tier-error/g' \
      -e 's/bg-ak-status-info/bg-tier-info/g' \
      -e 's/text-ak-status-info/text-tier-info/g' \
      -e 's/border-ak-status-info/border-tier-info/g' \
      -e 's/bg-ak-border-default/bg-tier-border-default/g' \
      -e 's/border-t-ak-border-default/border-t-tier-border-default/g' \
      "$file"
  fi
done

echo "=========================================="
echo "Migration complete!"
echo ""

# Count files with remaining ak-* tokens
remaining=$(find "$FEATURES_DIR" -type f \( -name "*.tsx" -o -name "*.jsx" \) -exec grep -l "ak-" {} \; | wc -l)
echo "Files with remaining ak-* tokens: $remaining"
