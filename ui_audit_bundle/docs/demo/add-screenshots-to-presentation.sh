#!/bin/bash

# Script to automatically add screenshots to presentation.html
# Run this AFTER you've captured all screenshots

PRESENTATION="/Users/anderskristiansen/Developer/IUP_Master_V1/docs/demo/presentation.html"
BACKUP="/Users/anderskristiansen/Developer/IUP_Master_V1/docs/demo/presentation.backup.html"
SCREENSHOTS_DIR="/Users/anderskristiansen/Developer/IUP_Master_V1/docs/demo/screenshots"

echo "🖼️  Adding Screenshots to Presentation"
echo "======================================"
echo ""

# Check if screenshots exist
if [ ! -d "$SCREENSHOTS_DIR" ]; then
    echo "❌ Screenshots directory not found: $SCREENSHOTS_DIR"
    echo "   Run: bash docs/demo/capture-all-screenshots.sh first"
    exit 1
fi

# Count screenshots
SCREENSHOT_COUNT=$(ls -1 "$SCREENSHOTS_DIR"/*.png 2>/dev/null | wc -l | tr -d ' ')

if [ "$SCREENSHOT_COUNT" -lt "6" ]; then
    echo "⚠️  Only found $SCREENSHOT_COUNT screenshots"
    echo "   Expected at least 6 screenshots"
    echo "   Run: bash docs/demo/capture-all-screenshots.sh to capture them"
    exit 1
fi

echo "✅ Found $SCREENSHOT_COUNT screenshots"
echo ""

# Create backup
echo "💾 Creating backup..."
cp "$PRESENTATION" "$BACKUP"
echo "   Backup saved: presentation.backup.html"
echo ""

# Add screenshots to presentation
echo "🖼️  Adding screenshots to presentation..."

# Replace placeholders with actual image tags
sed -i '' 's|<p><em>Screenshot: Player Dashboard (Andreas Holm)</em></p>.*\[01-player-dashboard-andreas.png vil vises her\].*</p>|<img src="screenshots/01-player-dashboard-andreas.png" alt="Andreas Holm Dashboard" style="max-height: 500px; width: auto;">|' "$PRESENTATION"

sed -i '' 's|<p><em>Screenshot: Training Plan Week View</em></p>.*\[04-training-plan-week-view.png vil vises her\].*</p>|<img src="screenshots/04-training-plan-week-view.png" alt="Training Plan" style="max-height: 500px; width: auto;">|' "$PRESENTATION"

sed -i '' 's|<p><em>Screenshot: Badges Grid</em></p>.*\[02-badges-grid.png vil vises her\].*</p>|<img src="screenshots/02-badges-grid.png" alt="Badges Grid" style="max-height: 500px; width: auto;">|' "$PRESENTATION"

sed -i '' 's|<p><em>Screenshot: Test Progression Graph</em></p>.*\[03-test-progression-graph.png vil vises her\].*</p>|<img src="screenshots/03-test-progression-graph.png" alt="Test Progression" style="max-height: 500px; width: auto;">|' "$PRESENTATION"

sed -i '' 's|<p><em>Screenshot: Coach Dashboard</em></p>.*\[06-coach-dashboard-overview.png vil vises her\].*</p>|<img src="screenshots/06-coach-dashboard-overview.png" alt="Coach Dashboard" style="max-height: 500px; width: auto;">|' "$PRESENTATION"

sed -i '' 's|<p><em>Screenshot: Mobile View</em></p>.*\[08-mobile-dashboard.png vil vises her\].*</p>|<img src="screenshots/08-mobile-dashboard.png" alt="Mobile View" style="max-height: 500px; width: auto;">|' "$PRESENTATION"

echo "   ✅ Screenshots added!"
echo ""

# Verify changes
if grep -q "screenshots/" "$PRESENTATION"; then
    echo "✅ Presentation updated successfully!"
    echo ""
    echo "📊 Summary:"
    echo "   Screenshots added: 6"
    echo "   Backup created: presentation.backup.html"
    echo ""
    echo "🎉 Ready to present!"
    echo ""
    echo "▶️  Open presentation:"
    echo "   open docs/demo/presentation.html"
else
    echo "❌ Failed to add screenshots"
    echo "   Restoring backup..."
    mv "$BACKUP" "$PRESENTATION"
    echo "   Presentation restored to original"
    exit 1
fi
