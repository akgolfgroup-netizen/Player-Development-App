#!/bin/bash

# IUP Golf Academy - Demo Screenshot Automation Script
# This script helps capture screenshots for the demo presentation

SCREENSHOT_DIR="/Users/anderskristiansen/Developer/IUP_Master_V1/docs/demo/screenshots"
DEMO_URL="http://localhost:3001"

echo "🎬 IUP Golf Academy - Screenshot Capture Script"
echo "================================================"
echo ""
echo "📁 Screenshots will be saved to: $SCREENSHOT_DIR"
echo "🌐 Demo URL: $DEMO_URL"
echo ""
echo "⚡ Make sure the web app is running and you're logged in!"
echo ""

# Check if web app is running
if ! curl -s $DEMO_URL > /dev/null; then
    echo "❌ Web app is not running at $DEMO_URL"
    echo "   Start it with: cd apps/web && npm start"
    exit 1
fi

echo "✅ Web app is running"
echo ""

# Function to capture screenshot with delay
capture() {
    local filename=$1
    local description=$2
    local delay=${3:-5}

    echo "📸 Next screenshot: $description"
    echo "   Filename: $filename"
    echo "   ⏱️  You have $delay seconds to prepare the screen..."
    echo ""
    echo "   INSTRUCTIONS:"
    case $filename in
        "01-player-dashboard-andreas.png")
            echo "   1. Make sure you're logged in as player@demo.com"
            echo "   2. Navigate to Dashboard (should be default landing page)"
            echo "   3. Scroll to top of page"
            echo "   4. Make browser window fullscreen (Cmd+Ctrl+F)"
            echo "   5. Hide bookmarks bar (Cmd+Shift+B)"
            ;;
        "02-badges-grid.png")
            echo "   1. Click on 'Badges' in the sidebar menu"
            echo "   2. Scroll to show the badge grid"
            echo "   3. Make sure earned badges are highlighted"
            ;;
        "03-test-progression-graph.png")
            echo "   1. Click on 'Tester' or 'Tests' in the sidebar"
            echo "   2. Scroll to show the progression graph"
            echo "   3. Make sure driver distance graph is visible"
            ;;
        "04-training-plan-week-view.png")
            echo "   1. Click on 'Treningsplan' or 'Training' in sidebar"
            echo "   2. Show the week view with color-coded sessions"
            echo "   3. Make sure periodization is visible"
            ;;
        "05-goals-milestones.png")
            echo "   1. Click on 'Mål' or 'Goals' in sidebar"
            echo "   2. Show all 8 goals with progress bars"
            echo "   3. Scroll to show completed and in-progress goals"
            ;;
        "06-coach-dashboard-overview.png")
            echo "   1. Logout from player account"
            echo "   2. Login as coach@demo.com / coach123"
            echo "   3. View player list on coach dashboard"
            echo "   4. Make sure Andreas Holm is visible in the list"
            ;;
        "07-coach-player-detail-andreas.png")
            echo "   1. (Still logged in as coach)"
            echo "   2. Click on Andreas Holm in the player list"
            echo "   3. Show detailed player view with stats and graphs"
            ;;
        "08-mobile-dashboard.png")
            echo "   1. Open browser DevTools (Cmd+Option+I)"
            echo "   2. Toggle device toolbar (Cmd+Shift+M)"
            echo "   3. Select 'iPhone 14 Pro' from device dropdown"
            echo "   4. Refresh page to see mobile view"
            echo "   5. Take screenshot of mobile viewport"
            ;;
    esac

    echo ""

    # Countdown
    for i in $(seq $delay -1 1); do
        echo -ne "   ⏳ Starting capture in $i seconds...\r"
        sleep 1
    done

    echo ""
    echo "   📸 Capturing screenshot NOW!"

    # Capture screenshot (full screen)
    screencapture -x "$SCREENSHOT_DIR/$filename"

    if [ -f "$SCREENSHOT_DIR/$filename" ]; then
        echo "   ✅ Screenshot saved: $filename"

        # Get file size
        size=$(du -h "$SCREENSHOT_DIR/$filename" | cut -f1)
        echo "   📊 File size: $size"
    else
        echo "   ❌ Failed to capture screenshot"
    fi

    echo ""
    echo "---"
    echo ""

    # Short pause before next instruction
    sleep 2
}

# Start capture sequence
echo "🎬 Starting screenshot capture in 10 seconds..."
echo "   Please open your browser and navigate to: $DEMO_URL"
echo "   Login with: player@demo.com / player123"
echo ""

sleep 10

# Capture all screenshots
capture "01-player-dashboard-andreas.png" "Player Dashboard (Andreas Holm)" 10
capture "02-badges-grid.png" "Badges Grid (24 earned)" 10
capture "03-test-progression-graph.png" "Test Progression Graph" 10
capture "04-training-plan-week-view.png" "Training Plan Week View" 10
capture "05-goals-milestones.png" "Goals & Milestones" 10
capture "06-coach-dashboard-overview.png" "Coach Dashboard Overview" 15
capture "07-coach-player-detail-andreas.png" "Coach - Andreas Holm Details" 10
capture "08-mobile-dashboard.png" "Mobile View (iPhone)" 15

echo ""
echo "🎉 Screenshot capture complete!"
echo ""
echo "📊 Summary:"
ls -lh "$SCREENSHOT_DIR"/*.png 2>/dev/null | wc -l | xargs echo "   Screenshots captured:"
echo ""
echo "📁 Screenshots saved to:"
echo "   $SCREENSHOT_DIR"
echo ""
echo "📝 Next steps:"
echo "   1. Review screenshots and retake any that need adjustment"
echo "   2. Compress screenshots if needed (< 500KB each recommended)"
echo "   3. Use screenshots in your presentation slides"
echo ""
echo "✨ Ready for demo! 🎉"
