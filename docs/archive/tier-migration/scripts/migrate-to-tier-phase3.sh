#!/bin/bash

# Phase 3 - CSS Spacing and remaining tokens
# Handles gap-ak-*, rounded-ak-*, p-ak-*, m-ak-*, etc.

FEATURES_DIR="/Users/anderskristiansen/Developer/IUP_Master_V1/apps/web/src/features"

echo "Starting Phase 3: CSS spacing and remaining tokens..."
echo "=========================================="

find "$FEATURES_DIR" -type f \( -name "*.tsx" -o -name "*.jsx" \) | while read file; do
  if grep -q "ak-" "$file"; then
    echo "Processing: $file"

    sed -i '' \
      -e 's/gap-ak-xs/gap-1/g' \
      -e 's/gap-ak-sm/gap-2/g' \
      -e 's/gap-ak-md/gap-4/g' \
      -e 's/gap-ak-lg/gap-6/g' \
      -e 's/gap-ak-xl/gap-8/g' \
      -e 's/p-ak-xs/p-1/g' \
      -e 's/p-ak-sm/p-2/g' \
      -e 's/p-ak-md/p-4/g' \
      -e 's/p-ak-lg/p-6/g' \
      -e 's/p-ak-xl/p-8/g' \
      -e 's/m-ak-xs/m-1/g' \
      -e 's/m-ak-sm/m-2/g' \
      -e 's/m-ak-md/m-4/g' \
      -e 's/m-ak-lg/m-6/g' \
      -e 's/m-ak-xl/m-8/g' \
      -e 's/rounded-ak-xs/rounded/g' \
      -e 's/rounded-ak-sm/rounded-md/g' \
      -e 's/rounded-ak-md/rounded-lg/g' \
      -e 's/rounded-ak-lg/rounded-xl/g' \
      -e 's/rounded-ak-xl/rounded-2xl/g' \
      -e 's/\bak-session-kompetanse\b/tier-session-mental/g' \
      -e 's/\bak-session-teknikk\b/tier-session-technique/g' \
      -e 's/\bak-session-golfslag\b/tier-session-shots/g' \
      -e 's/\bak-session-spill\b/tier-session-game/g' \
      -e 's/\bak-session-fysisk\b/tier-session-physical/g' \
      "$file"
  fi
done

echo "=========================================="
echo "Phase 3 complete!"

# Count remaining
remaining=$(find "$FEATURES_DIR" -type f \( -name "*.tsx" -o -name "*.jsx" \) -exec grep -l " ak-" {} \; 2>/dev/null | wc -l)
echo "Files with remaining ak-* tokens: $remaining"

# Show what's left
echo ""
echo "Remaining tokens (top 20):"
find "$FEATURES_DIR" -type f \( -name "*.tsx" -o -name "*.jsx" \) -exec grep -oh " ak-[a-zA-Z-]*" {} \; 2>/dev/null | sort | uniq -c | sort -rn | head -20
