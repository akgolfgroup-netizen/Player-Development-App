#!/bin/bash

# Edge cases cleanup - handles all remaining special tokens

FEATURES_DIR="/Users/anderskristiansen/Developer/IUP_Master_V1/apps/web/src/features"

echo "Starting Edge Cases Cleanup..."
echo "=========================================="

find "$FEATURES_DIR" -type f \( -name "*.tsx" -o -name "*.jsx" \) | while read file; do
  if grep -q "ak-" "$file"; then
    echo "Cleaning edge cases: $file"

    # Core tokens that might have slipped through
    sed -i '' \
      -e 's/\<ak-primary\>/tier-navy/g' \
      -e 's/\<ak-success\>/tier-success/g' \
      -e 's/\<ak-warning\>/tier-warning/g' \
      -e 's/\<ak-error\>/tier-error/g' \
      -e 's/\<ak-info\>/tier-info/g' \
      -e 's/\<ak-text-primary\>/tier-navy/g' \
      -e 's/\<ak-text-secondary\>/tier-text-secondary/g' \
      -e 's/\<ak-text-tertiary\>/tier-text-tertiary/g' \
      -e 's/\<ak-surface-base\>/tier-white/g' \
      -e 's/\<ak-surface-subtle\>/tier-surface-base/g' \
      -e 's/\<ak-border-default\>/tier-border-default/g' \
      "$file"

    # Surface variants
    sed -i '' \
      -e 's/ak-surface-page/tier-surface-base/g' \
      -e 's/ak-surface-hover/tier-surface-base/g' \
      -e 's/ak-surface-default/tier-white/g' \
      -e 's/ak-elevated/tier-white/g' \
      -e 's/\<ak-surface\>/tier-white/g' \
      "$file"

    # Border variants
    sed -i '' \
      -e 's/ak-border-strong/tier-border-default/g' \
      -e 's/\<ak-border\>/tier-border-default/g' \
      "$file"

    # Color variants
    sed -i '' \
      -e 's/\<ak-navy\>/tier-navy/g' \
      -e 's/\<ak-ink\>/tier-navy/g' \
      -e 's/ak-light/tier-white/g' \
      -e 's/\<ak-base\>/tier-white/g' \
      "$file"

    # Primary variants
    sed -i '' \
      -e 's/ak-primary-600/tier-navy\/80/g' \
      -e 's/ak-primary-400/tier-navy\/60/g' \
      -e 's/ak-primary-200/tier-navy\/20/g' \
      -e 's/ak-bg-primary/tier-navy/g' \
      "$file"

    # Status variants
    sed -i '' \
      -e 's/ak-status-success/tier-success/g' \
      -e 's/ak-component-progress-success/tier-success/g' \
      "$file"

    # Special colors
    sed -i '' \
      -e 's/ak-accent-pink/#EC4899/g' \
      "$file"

    # Session colors (all variants)
    sed -i '' \
      -e 's/\<ak-session-kompetanse\>/#9333EA/g' \
      -e 's/\<ak-session-teknikk\>/#EC4899/g' \
      -e 's/ak-session-teknikkMuted/#EC489980/g' \
      -e 's/\<ak-session-golfslag\>/#3B82F6/g' \
      -e 's/ak-session-golfslagMuted/#3B82F680/g' \
      -e 's/\<ak-session-spill\>/#10B981/g' \
      -e 's/ak-session-spillMuted/#10B98180/g' \
      -e 's/\<ak-session-fysisk\>/#F59E0B/g' \
      -e 's/ak-session-fysiskMuted/#F59E0B80/g' \
      -e 's/ak-session-funksjonellMuted/#F59E0B80/g' \
      -e 's/ak-session-test/#8B5CF6/g' \
      -e 's/ak-session-hjemme/#10B981/g' \
      -e 's/ak-session-/#3B82F6/g' \
      "$file"

    # Speed tokens
    sed -i '' \
      -e 's/\<ak-fast\>/150ms/g' \
      -e 's/\<ak-normal\>/300ms/g' \
      -e 's/\<ak-slow\>/500ms/g' \
      "$file"

    # Misc
    sed -i '' \
      -e 's/ak-3/3/g' \
      "$file"
  fi
done

echo "=========================================="
echo "Edge Cases Cleanup Complete!"
echo ""

# Final statistics
total_files=$(find "$FEATURES_DIR" -type f \( -name "*.tsx" -o -name "*.jsx" \) | wc -l)
migrated_files=$(find "$FEATURES_DIR" -type f \( -name "*.tsx" -o -name "*.jsx" \) -exec grep -L "ak-" {} \; | wc -l)
remaining_files=$(find "$FEATURES_DIR" -type f \( -name "*.tsx" -o -name "*.jsx" \) -exec grep -l "ak-" {} \; | wc -l)

echo "=== FINAL MIGRATION STATISTICS ==="
echo "Total .tsx/.jsx files: $total_files"
echo "Fully migrated to TIER: $migrated_files ($(echo "scale=1; $migrated_files * 100 / $total_files" | bc)%)"
echo "Still contain ak-* tokens: $remaining_files ($(echo "scale=1; $remaining_files * 100 / $total_files" | bc)%)"
echo ""

if [ "$remaining_files" -gt 0 ]; then
  echo "Files still needing manual review:"
  find "$FEATURES_DIR" -type f \( -name "*.tsx" -o -name "*.jsx" \) -exec grep -l "ak-" {} \; | head -20
  echo ""
  echo "Unique remaining tokens:"
  find "$FEATURES_DIR" -type f \( -name "*.tsx" -o -name "*.jsx" \) -exec grep -oh "\bak-[a-zA-Z0-9_-]*" {} \; | sort -u
fi
