#!/bin/bash

# Phase 2 - Additional ak-* token migrations
# Handles spacing, card surfaces, and other design tokens

FEATURES_DIR="/Users/anderskristiansen/Developer/IUP_Master_V1/apps/web/src/features"

echo "Starting Phase 2: Additional token migrations..."
echo "=========================================="

find "$FEATURES_DIR" -type f \( -name "*.tsx" -o -name "*.jsx" \) | while read file; do
  if grep -q "ak-" "$file"; then
    echo "Processing: $file"

    sed -i '' \
      -e 's/\bak-xs\b/tier-xs/g' \
      -e 's/\bak-sm\b/tier-sm/g' \
      -e 's/\bak-md\b/tier-md/g' \
      -e 's/\bak-lg\b/tier-lg/g' \
      -e 's/\bak-xl\b/tier-xl/g' \
      -e 's/ak-surface-card/tier-white/g' \
      -e 's/ak-surface-elevated/tier-white/g' \
      -e 's/ak-surface-muted/tier-surface-base/g' \
      -e 's/ak-border-subtle/tier-border-default/g' \
      -e 's/ak-border-muted/tier-border-default/g' \
      -e 's/\bak-primary\b/tier-navy/g' \
      -e 's/\bak-success\b/tier-success/g' \
      -e 's/\bak-warning\b/tier-warning/g' \
      -e 's/\bak-error\b/tier-error/g' \
      -e 's/ak-steel/tier-text-secondary/g' \
      -e 's/ak-charcoal/tier-navy/g' \
      -e 's/ak-mist/tier-surface-base/g' \
      -e 's/ak-snow/tier-white/g' \
      -e 's/ak-gold/tier-gold/g' \
      -e 's/ak-card/tier-white/g' \
      -e 's/ak-text-muted/tier-text-tertiary/g' \
      "$file"
  fi
done

echo "=========================================="
echo "Phase 2 complete!"

# Count remaining
remaining=$(find "$FEATURES_DIR" -type f \( -name "*.tsx" -o -name "*.jsx" \) -exec grep -l "ak-" {} \; | wc -l)
echo "Files with remaining ak-* tokens: $remaining"

# Show what's left
echo ""
echo "Remaining tokens:"
find "$FEATURES_DIR" -type f \( -name "*.tsx" -o -name "*.jsx" \) -exec grep -oh "ak-[a-zA-Z-]*" {} \; | sort | uniq -c | sort -rn | head -20
