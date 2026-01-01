#!/bin/bash

# Simple screenshot capture helper
# Usage: ./capture-screenshot.sh <filename> <delay_seconds>

SCREENSHOT_DIR="/Users/anderskristiansen/Developer/IUP_Master_V1/docs/demo/screenshots"
FILENAME=${1:-"screenshot.png"}
DELAY=${2:-5}

echo "📸 Screenshot Capture"
echo "===================="
echo ""
echo "Will save to: $SCREENSHOT_DIR/$FILENAME"
echo ""

# Countdown
for i in $(seq $DELAY -1 1); do
    echo -ne "⏳ Capturing in $i seconds... (Prepare your screen!)\r"
    sleep 1
done

echo ""
echo "📸 CAPTURING NOW!"

# Take screenshot of main display
screencapture -x "$SCREENSHOT_DIR/$FILENAME"

if [ -f "$SCREENSHOT_DIR/$FILENAME" ]; then
    size=$(du -h "$SCREENSHOT_DIR/$FILENAME" | cut -f1)
    echo "✅ Screenshot saved: $FILENAME ($size)"
else
    echo "❌ Failed to capture screenshot"
    exit 1
fi
