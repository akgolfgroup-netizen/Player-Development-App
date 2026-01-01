#!/bin/bash

# Master script to capture all demo screenshots
# This provides prompts and instructions for each screenshot

SCREENSHOT_DIR="/Users/anderskristiansen/Developer/IUP_Master_V1/docs/demo/screenshots"
DEMO_URL="http://localhost:3001"

echo "🎬 IUP Golf Academy - Screenshot Capture Wizard"
echo "================================================"
echo ""
echo "This script will guide you through capturing all 8 screenshots"
echo "needed for the demo presentation."
echo ""
echo "📁 Screenshots will be saved to:"
echo "   $SCREENSHOT_DIR"
echo ""
echo "🌐 Demo URL: $DEMO_URL"
echo ""

# Check if web app is running
echo "Checking if web app is running..."
if ! curl -s $DEMO_URL > /dev/null 2>&1; then
    echo "❌ Web app is not running at $DEMO_URL"
    echo ""
    echo "Please start it first:"
    echo "   cd apps/web && npm start"
    echo ""
    exit 1
fi

echo "✅ Web app is running"
echo ""

# Function to capture with instructions
capture() {
    local num=$1
    local filename=$2
    local title=$3
    shift 3
    local instructions=("$@")

    echo ""
    echo "============================================"
    echo "📸 Screenshot $num of 8: $title"
    echo "============================================"
    echo ""
    echo "📝 INSTRUCTIONS:"
    for instruction in "${instructions[@]}"; do
        echo "   $instruction"
    done
    echo ""
    echo "Press ENTER when ready to capture (10 second countdown will start)..."
    read

    # Countdown
    for i in {10..1}; do
        echo -ne "⏳ Capturing in $i seconds... \r"
        sleep 1
    done

    echo ""
    echo "📸 CAPTURING NOW!"

    screencapture -x "$SCREENSHOT_DIR/$filename"

    if [ -f "$SCREENSHOT_DIR/$filename" ]; then
        size=$(du -h "$SCREENSHOT_DIR/$filename" | cut -f1)
        echo "✅ Screenshot saved: $filename ($size)"
    else
        echo "❌ Failed to capture $filename"
    fi

    sleep 1
}

echo "========================================"
echo "🚀 Ready to start!"
echo "========================================"
echo ""
echo "Before we begin:"
echo "   1. Open your browser to: $DEMO_URL"
echo "   2. Make browser window FULLSCREEN (Cmd+Ctrl+F)"
echo "   3. Hide bookmarks bar (Cmd+Shift+B)"
echo "   4. Set browser zoom to 100% (Cmd+0)"
echo ""
echo "Press ENTER when ready to start..."
read

# Screenshot 1: Player Dashboard
capture 1 "01-player-dashboard-andreas.png" "Player Dashboard (Andreas Holm)" \
    "1. Login with: player@demo.com / player123" \
    "2. You should land on the dashboard" \
    "3. Scroll to TOP of page" \
    "4. Make sure profile info, stats, and graphs are visible" \
    "5. Focus browser window (click on it)"

# Screenshot 2: Badges Grid
capture 2 "02-badges-grid.png" "Badges Grid" \
    "1. Click 'Badges' or 'Merker' in the sidebar" \
    "2. Should see grid of badges" \
    "3. 24 badges should be colored/earned" \
    "4. Others should be gray/locked" \
    "5. Focus browser window"

# Screenshot 3: Test Progression
capture 3 "03-test-progression-graph.png" "Test Progression Graph" \
    "1. Click 'Tester' or 'Tests' in the sidebar" \
    "2. Should see test results with graphs" \
    "3. Look for driver distance and putting accuracy graphs" \
    "4. Make sure progression is visible (upward trends)" \
    "5. Focus browser window"

# Screenshot 4: Training Plan
capture 4 "04-training-plan-week-view.png" "Training Plan - Week View" \
    "1. Click 'Treningsplan' or 'Training' in sidebar" \
    "2. Should see week calendar view" \
    "3. Sessions should be color-coded" \
    "4. Periodization visible if possible" \
    "5. Focus browser window"

# Screenshot 5: Goals
capture 5 "05-goals-milestones.png" "Goals & Milestones" \
    "1. Click 'Mål' or 'Goals' in sidebar" \
    "2. Should see list of 8 goals" \
    "3. Progress bars should be visible" \
    "4. Completed goals should have checkmarks" \
    "5. Focus browser window"

# Screenshot 6: Coach Dashboard
capture 6 "06-coach-dashboard-overview.png" "Coach Dashboard - Overview" \
    "1. LOGOUT from player account (top right menu)" \
    "2. LOGIN with: coach@demo.com / coach123" \
    "3. Should see coach dashboard with player list" \
    "4. Andreas Holm should be in the list" \
    "5. Focus browser window"

# Screenshot 7: Coach Player Detail
capture 7 "07-coach-player-detail-andreas.png" "Coach - Andreas Holm Details" \
    "1. (Still logged in as coach)" \
    "2. Click on 'Andreas Holm' in the player list" \
    "3. Should open detailed player view" \
    "4. Graphs and stats should be visible" \
    "5. Focus browser window"

# Screenshot 8: Mobile View
capture 8 "08-mobile-dashboard.png" "Mobile View (iPhone)" \
    "1. Open DevTools: Cmd+Option+I" \
    "2. Toggle device toolbar: Cmd+Shift+M" \
    "3. Select 'iPhone 14 Pro' from dropdown" \
    "4. Refresh page, login as player@demo.com if needed" \
    "5. Should see mobile-responsive layout" \
    "6. Focus browser window"

echo ""
echo "============================================"
echo "🎉 Screenshot Capture Complete!"
echo "============================================"
echo ""
echo "📊 Summary:"
ls -lh "$SCREENSHOT_DIR"/*.png 2>/dev/null | wc -l | tr -d ' ' | xargs -I {} echo "   {} screenshots captured"
echo ""
echo "📁 Location:"
echo "   $SCREENSHOT_DIR"
echo ""
echo "📝 Review your screenshots:"
echo "   open $SCREENSHOT_DIR"
echo ""
echo "📋 Next steps:"
echo "   1. Review all screenshots for quality"
echo "   2. Retake any that need adjustment"
echo "   3. Follow SLIDES_CHECKLIST.md to create presentation"
echo ""
echo "✨ Ready for demo! 🎉"
