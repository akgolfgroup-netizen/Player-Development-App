/**
 * IUP Golf Academy - Automated Screenshot Capture
 *
 * This script uses Playwright to automatically:
 * 1. Login to the demo app
 * 2. Navigate through all screens
 * 3. Capture high-quality screenshots
 *
 * Usage:
 *   npx playwright install chromium  # First time only
 *   node docs/demo/screenshot-automation.js
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const DEMO_URL = 'http://localhost:3001';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');
const CREDENTIALS = {
  player: { email: 'player@demo.com', password: 'player123' },
  coach: { email: 'coach@demo.com', password: 'coach123' },
};

// Ensure screenshot directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function takeScreenshot(page, filename, description) {
  const filepath = path.join(SCREENSHOT_DIR, filename);

  console.log(`📸 Capturing: ${description}`);
  console.log(`   File: ${filename}`);

  // Wait for page to be fully loaded
  await page.waitForLoadState('networkidle');
  await delay(1000); // Extra delay for animations

  // Take screenshot
  await page.screenshot({
    path: filepath,
    fullPage: false, // Capture viewport only (above the fold)
  });

  const stats = fs.statSync(filepath);
  const sizeKB = (stats.size / 1024).toFixed(2);
  console.log(`   ✅ Saved: ${sizeKB} KB\n`);
}

async function captureScreenshots() {
  console.log('🎬 IUP Golf Academy - Automated Screenshot Capture');
  console.log('===================================================\n');

  const browser = await chromium.launch({
    headless: false, // Show browser for debugging
    slowMo: 500, // Slow down actions for visibility
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2, // Retina display quality
  });

  const page = await context.newPage();

  try {
    // Navigate to app
    console.log(`🌐 Navigating to: ${DEMO_URL}\n`);
    await page.goto(DEMO_URL);
    await delay(2000);

    // ========================================
    // 1. Login as Player
    // ========================================
    console.log('🔐 Logging in as player...\n');

    await page.fill('input[type="email"], input[name="email"]', CREDENTIALS.player.email);
    await page.fill('input[type="password"], input[name="password"]', CREDENTIALS.player.password);
    await page.click('button[type="submit"], button:has-text("Logg inn")');

    await delay(3000); // Wait for redirect to dashboard

    // ========================================
    // 2. Dashboard Screenshot
    // ========================================
    await takeScreenshot(
      page,
      '01-player-dashboard-andreas.png',
      'Player Dashboard (Andreas Holm)'
    );

    // ========================================
    // 3. Badges Screenshot
    // ========================================
    console.log('📛 Navigating to Badges...\n');

    // Try multiple selectors for badges navigation
    const badgeSelectors = [
      'a:has-text("Badges")',
      'a:has-text("Merker")',
      'a[href*="badges"]',
      'nav a:has-text("Badge")',
    ];

    for (const selector of badgeSelectors) {
      try {
        await page.click(selector, { timeout: 2000 });
        break;
      } catch (e) {
        // Try next selector
      }
    }

    await delay(2000);
    await takeScreenshot(
      page,
      '02-badges-grid.png',
      'Badges Grid (24 earned)'
    );

    // ========================================
    // 4. Tests/Progress Screenshot
    // ========================================
    console.log('📊 Navigating to Tests...\n');

    const testSelectors = [
      'a:has-text("Tester")',
      'a:has-text("Tests")',
      'a[href*="test"]',
      'a:has-text("Progresjon")',
    ];

    for (const selector of testSelectors) {
      try {
        await page.click(selector, { timeout: 2000 });
        break;
      } catch (e) {
        // Try next selector
      }
    }

    await delay(2000);
    await takeScreenshot(
      page,
      '03-test-progression-graph.png',
      'Test Progression Graph'
    );

    // ========================================
    // 5. Training Plan Screenshot
    // ========================================
    console.log('📅 Navigating to Training Plan...\n');

    const trainingSelectors = [
      'a:has-text("Treningsplan")',
      'a:has-text("Training")',
      'a[href*="training"]',
      'a:has-text("Plan")',
    ];

    for (const selector of trainingSelectors) {
      try {
        await page.click(selector, { timeout: 2000 });
        break;
      } catch (e) {
        // Try next selector
      }
    }

    await delay(2000);
    await takeScreenshot(
      page,
      '04-training-plan-week-view.png',
      'Training Plan Week View'
    );

    // ========================================
    // 6. Goals Screenshot
    // ========================================
    console.log('🎯 Navigating to Goals...\n');

    const goalSelectors = [
      'a:has-text("Mål")',
      'a:has-text("Goals")',
      'a[href*="goal"]',
    ];

    for (const selector of goalSelectors) {
      try {
        await page.click(selector, { timeout: 2000 });
        break;
      } catch (e) {
        // Try next selector
      }
    }

    await delay(2000);
    await takeScreenshot(
      page,
      '05-goals-milestones.png',
      'Goals & Milestones'
    );

    // ========================================
    // 7. Logout and Login as Coach
    // ========================================
    console.log('👤 Switching to coach account...\n');

    // Try to find and click logout
    try {
      await page.click('button:has-text("Logg ut"), a:has-text("Logg ut"), [aria-label="Logout"]', { timeout: 2000 });
    } catch (e) {
      // If logout fails, just navigate to login
      await page.goto(DEMO_URL);
    }

    await delay(2000);

    // Login as coach
    await page.fill('input[type="email"], input[name="email"]', CREDENTIALS.coach.email);
    await page.fill('input[type="password"], input[name="password"]', CREDENTIALS.coach.password);
    await page.click('button[type="submit"], button:has-text("Logg inn")');

    await delay(3000);

    // ========================================
    // 8. Coach Dashboard Screenshot
    // ========================================
    await takeScreenshot(
      page,
      '06-coach-dashboard-overview.png',
      'Coach Dashboard Overview'
    );

    // ========================================
    // 9. Coach - Player Detail Screenshot
    // ========================================
    console.log('👨‍🏫 Opening Andreas Holm player detail...\n');

    try {
      // Try to click on Andreas Holm in player list
      await page.click('text=Andreas Holm', { timeout: 5000 });
      await delay(2000);

      await takeScreenshot(
        page,
        '07-coach-player-detail-andreas.png',
        'Coach - Andreas Holm Details'
      );
    } catch (e) {
      console.log('   ⚠️  Could not find Andreas Holm in player list, skipping...\n');
    }

    // ========================================
    // 10. Mobile View Screenshot
    // ========================================
    console.log('📱 Switching to mobile view...\n');

    // Create mobile context
    const mobileContext = await browser.newContext({
      ...chromium.devices['iPhone 14 Pro'],
      deviceScaleFactor: 2,
    });

    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(DEMO_URL);
    await delay(2000);

    // Login on mobile
    await mobilePage.fill('input[type="email"], input[name="email"]', CREDENTIALS.player.email);
    await mobilePage.fill('input[type="password"], input[name="password"]', CREDENTIALS.player.password);
    await mobilePage.click('button[type="submit"], button:has-text("Logg inn")');
    await delay(3000);

    await takeScreenshot(
      mobilePage,
      '08-mobile-dashboard.png',
      'Mobile View (iPhone 14 Pro)'
    );

    await mobileContext.close();

    console.log('✅ All screenshots captured successfully!\n');

  } catch (error) {
    console.error('❌ Error during screenshot capture:', error);
  } finally {
    await browser.close();
  }

  // Print summary
  console.log('\n📊 Screenshot Summary');
  console.log('=====================\n');

  const files = fs.readdirSync(SCREENSHOT_DIR).filter(f => f.endsWith('.png'));

  files.forEach(file => {
    const filepath = path.join(SCREENSHOT_DIR, file);
    const stats = fs.statSync(filepath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`   ✅ ${file} (${sizeKB} KB)`);
  });

  console.log(`\n📁 Screenshots saved to: ${SCREENSHOT_DIR}`);
  console.log('\n🎉 Ready for demo presentation!');
}

// Run the script
captureScreenshots().catch(console.error);
