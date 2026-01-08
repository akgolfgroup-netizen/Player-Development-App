#!/bin/bash

# Final comprehensive pass - handles all edge cases and special tokens

FEATURES_DIR="/Users/anderskristiansen/Developer/IUP_Master_V1/apps/web/src/features"

echo "Starting FINAL comprehensive pass..."
echo "=========================================="

find "$FEATURES_DIR" -type f \( -name "*.tsx" -o -name "*.jsx" \) | while read file; do
  if grep -q "ak-" "$file"; then
    echo "Final pass: $file"

    # Core design tokens
    sed -i '' \
      -e 's/\bak-primary\b/tier-navy/g' \
      -e 's/\bak-success\b/tier-success/g' \
      -e 's/\bak-warning\b/tier-warning/g' \
      -e 's/\bak-error\b/tier-error/g' \
      -e 's/\bak-text-primary\b/tier-navy/g' \
      -e 's/\bak-text-secondary\b/tier-text-secondary/g' \
      -e 's/\bak-text-tertiary\b/tier-text-tertiary/g' \
      -e 's/\bak-surface-base\b/tier-white/g' \
      -e 's/\bak-surface-subtle\b/tier-surface-base/g' \
      -e 's/\bak-border-default\b/tier-border-default/g' \
      "$file"

    # Special status variants
    sed -i '' \
      -e 's/ak-status-warningMuted/tier-warning\/20/g' \
      -e 's/ak-status-warning/tier-warning/g' \
      -e 's/ak-status-success-light/tier-success\/20/g' \
      -e 's/ak-status-info-light/tier-info\/20/g' \
      -e 's/ak-status-error-bg/tier-error\/10/g' \
      -e 's/ak-status-error/tier-error/g' \
      -e 's/ak-primaryMuted/tier-navy\/20/g' \
      -e 's/ak-primary-rgb/1,33,74/g' \
      "$file"

    # Surface variants
    sed -i '' \
      -e 's/ak-surface-dark-base/tier-navy/g' \
      -e 's/\bak-surface\b/tier-white/g' \
      -e 's/ak-text-inverse/tier-white/g' \
      "$file"

    # Special colors
    sed -i '' \
      -e 's/\bak-navy\b/tier-navy/g' \
      -e 's/\bak-ink\b/tier-navy/g' \
      -e 's/ak-medal-gold/#FFD700/g' \
      -e 's/ak-medal-silver/#C0C0C0/g' \
      -e 's/ak-medal-bronze/#CD7F32/g' \
      "$file"

    # Session colors
    sed -i '' \
      -e 's/\bak-session-kompetanse\b/#9333EA/g' \
      -e 's/\bak-session-teknikk\b/#EC4899/g' \
      -e 's/\bak-session-golfslag\b/#3B82F6/g' \
      -e 's/\bak-session-spill\b/#10B981/g' \
      -e 's/\bak-session-fysisk\b/#F59E0B/g' \
      "$file"

    # Speed/animation tokens
    sed -i '' \
      -e 's/\bak-fast\b/150ms/g' \
      -e 's/\bak-normal\b/300ms/g' \
      -e 's/\bak-slow\b/500ms/g' \
      "$file"
  fi
done

echo "=========================================="
echo "FINAL PASS COMPLETE!"
echo ""

# Final statistics
total_files=$(find "$FEATURES_DIR" -type f \( -name "*.tsx" -o -name "*.jsx" \) | wc -l)
migrated_files=$(find "$FEATURES_DIR" -type f \( -name "*.tsx" -o -name "*.jsx" \) -exec grep -L "ak-" {} \; | wc -l)
remaining_files=$(find "$FEATURES_DIR" -type f \( -name "*.tsx" -o -name "*.jsx" \) -exec grep -l "ak-" {} \; | wc -l)

echo "MIGRATION STATISTICS:"
echo "  Total files: $total_files"
echo "  Fully migrated: $migrated_files"
echo "  Still with ak-* tokens: $remaining_files"
echo ""

if [ "$remaining_files" -gt 0 ]; then
  echo "Remaining tokens (all):"
  find "$FEATURES_DIR" -type f \( -name "*.tsx" -o -name "*.jsx" \) -exec grep -oh "\bak-[a-zA-Z0-9_-]*" {} \; | sort | uniq -c | sort -rn
fi
