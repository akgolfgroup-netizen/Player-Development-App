#!/bin/bash

# Cleanup script - Remove all remaining ak-* spacing and color tokens
# This handles rounded-ak-*, gap-ak-*, shadow-ak-* and session colors

FEATURES_DIR="/Users/anderskristiansen/Developer/IUP_Master_V1/apps/web/src/features"

echo "Starting Cleanup: Removing all remaining ak-* tokens..."
echo "=========================================="

find "$FEATURES_DIR" -type f \( -name "*.tsx" -o -name "*.jsx" \) | while read file; do
  if grep -q "ak-" "$file"; then
    echo "Cleaning: $file"

    sed -i '' \
      -e 's/rounded-ak-xs/rounded/g' \
      -e 's/rounded-ak-sm/rounded-md/g' \
      -e 's/rounded-ak-md/rounded-lg/g' \
      -e 's/rounded-ak-lg/rounded-xl/g' \
      -e 's/rounded-ak-xl/rounded-2xl/g' \
      -e 's/gap-ak-xs/gap-1/g' \
      -e 's/gap-ak-sm/gap-2/g' \
      -e 's/gap-ak-md/gap-4/g' \
      -e 's/gap-ak-lg/gap-6/g' \
      -e 's/gap-ak-xl/gap-8/g' \
      -e 's/shadow-ak-sm/shadow-sm/g' \
      -e 's/shadow-ak-md/shadow-md/g' \
      -e 's/shadow-ak-lg/shadow-lg/g' \
      -e 's/\bak-session-kompetanse\b/#9333EA/g' \
      -e 's/\bak-session-teknikk\b/#EC4899/g' \
      -e 's/\bak-session-golfslag\b/#3B82F6/g' \
      -e 's/\bak-session-spill\b/#10B981/g' \
      -e 's/\bak-session-fysisk\b/#F59E0B/g' \
      -e 's/ak-session-kompetanse-muted/#9333EA80/g' \
      -e 's/ak-session-teknikk-muted/#EC489980/g' \
      -e 's/ak-session-golfslag-muted/#3B82F680/g' \
      -e 's/ak-session-spill-muted/#10B98180/g' \
      -e 's/ak-session-fysisk-muted/#F59E0B80/g' \
      -e 's/ak-component-progress-fill/tier-navy/g' \
      -e 's/ak-component-progress-bg/tier-surface-base/g' \
      -e 's/ak-brand-hover/tier-navy\/90/g' \
      -e 's/ak-prestige/#FFD700/g' \
      -e 's/\bak-primary-\b/tier-navy-/g' \
      "$file"

    # Catch any remaining standalone spacing tokens
    sed -i '' \
      -e 's/\bak-xs\b/1/g' \
      -e 's/\bak-sm\b/2/g' \
      -e 's/\bak-md\b/4/g' \
      -e 's/\bak-lg\b/6/g' \
      -e 's/\bak-xl\b/8/g' \
      "$file"

    # One more pass for any missed surface/border/text tokens
    sed -i '' \
      -e 's/\bak-surface-base\b/tier-white/g' \
      -e 's/\bak-surface-subtle\b/tier-surface-base/g' \
      -e 's/\bak-border-default\b/tier-border-default/g' \
      -e 's/\bak-text-primary\b/tier-navy/g' \
      -e 's/\bak-text-secondary\b/tier-text-secondary/g' \
      -e 's/\bak-text-tertiary\b/tier-text-tertiary/g' \
      -e 's/\bak-primary\b/tier-navy/g' \
      -e 's/\bak-success\b/tier-success/g' \
      -e 's/\bak-warning\b/tier-warning/g' \
      -e 's/\bak-error\b/tier-error/g' \
      "$file"
  fi
done

echo "=========================================="
echo "Cleanup complete!"

# Final count
remaining=$(find "$FEATURES_DIR" -type f \( -name "*.tsx" -o -name "*.jsx" \) -exec grep -l "ak-" {} \; 2>/dev/null | wc -l)
echo "Files with remaining ak-* tokens: $remaining"

if [ "$remaining" -gt 0 ]; then
  echo ""
  echo "Remaining tokens:"
  find "$FEATURES_DIR" -type f \( -name "*.tsx" -o -name "*.jsx" \) -exec grep -oh "\bak-[a-zA-Z0-9-]*" {} \; 2>/dev/null | sort | uniq -c | sort -rn | head -30
fi
