/**
 * CONTRACT ENFORCEMENT TESTS
 *
 * Purpose:
 * - Prevent future violations of authority and meaning
 * - These tests must NEVER be removed
 *
 * Contract references:
 * - COACH_ADMIN_IMPLEMENTATION_CONTRACT.md
 * - COACH_ADMIN_SCREEN_CONTRACT.md
 */

import fs from "fs";
import path from "path";

const FEATURES_DIR = path.resolve(__dirname, "..");

// Get all coach screen directories (coach-*)
function getCoachDirs(): string[] {
  return fs
    .readdirSync(FEATURES_DIR)
    .filter((name) => name.startsWith("coach-"))
    .map((name) => path.join(FEATURES_DIR, name));
}

// Get all admin screen directories (admin-*)
function getAdminDirs(): string[] {
  return fs
    .readdirSync(FEATURES_DIR)
    .filter((name) => name.startsWith("admin-"))
    .map((name) => path.join(FEATURES_DIR, name));
}

// Get all TypeScript/TSX files in a directory
function getTsFiles(dir: string): string[] {
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".ts") || file.endsWith(".tsx"))
    .map((file) => path.join(dir, file));
}

// Read file content, filtering out comments
function readFileFiltered(filePath: string): string {
  const content = fs.readFileSync(filePath, "utf8");
  return content
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim();
      return (
        !trimmed.startsWith("//") &&
        !trimmed.startsWith("*") &&
        !trimmed.startsWith("/*")
      );
    })
    .join("\n");
}

describe("Contract enforcement", () => {
  test("Coach PROOF viewer must import shared Proof component (CPV-C01)", () => {
    const cpvDir = path.join(FEATURES_DIR, "coach-proof-viewer");
    const files = getTsFiles(cpvDir);

    const usesSharedProof = files.some((file) =>
      fs.readFileSync(file, "utf8").includes("components/proof/Proof")
    );

    expect(usesSharedProof).toBe(true);
  });

  test("Coach TRAJECTORY viewer must import shared Trajectory component (CTV-C01)", () => {
    const ctvDir = path.join(FEATURES_DIR, "coach-trajectory-viewer");
    const files = getTsFiles(ctvDir);

    const usesSharedTrajectory = files.some((file) =>
      fs.readFileSync(file, "utf8").includes("components/trajectory/Trajectory")
    );

    expect(usesSharedTrajectory).toBe(true);
  });

  test("Admin screens must not import athlete/performance components (AD-*)", () => {
    const adminDirs = getAdminDirs();
    const forbiddenImports = [
      /from.*["'].*Athlete/i,
      /from.*["'].*Proof/i,
      /from.*["'].*Trajectory/i,
      /from.*["'].*Session/i,
      /from.*["'].*Baseline/i,
    ];

    adminDirs.forEach((dir) => {
      getTsFiles(dir).forEach((file) => {
        const content = fs.readFileSync(file, "utf8");

        forbiddenImports.forEach((pattern) => {
          expect(content).not.toMatch(pattern);
        });
      });
    });
  });

  test("No ranking keywords in coach screens (FI-01, FI-02)", () => {
    const forbidden = [
      "\\brank\\b",
      "\\bleaderboard\\b",
      "\\btop\\s+\\d+\\b",
      "\\bbest\\s+player",
      "\\bworst\\s+player",
    ];

    getCoachDirs().forEach((dir) => {
      getTsFiles(dir).forEach((file) => {
        const content = readFileFiltered(file).toLowerCase();

        forbidden.forEach((pattern) => {
          expect(content).not.toMatch(new RegExp(pattern, "i"));
        });
      });
    });
  });

  test("No performance sorting in athlete lists (FI-03)", () => {
    const calDir = path.join(FEATURES_DIR, "coach-athlete-list");
    const files = getTsFiles(calDir);

    const forbiddenSorts = [
      /sort.*by.*performance/i,
      /sort.*by.*score/i,
      /sort.*by.*rating/i,
      /sort.*by.*trend/i,
    ];

    files.forEach((file) => {
      const content = readFileFiltered(file);

      forbiddenSorts.forEach((pattern) => {
        expect(content).not.toMatch(pattern);
      });
    });
  });

  test("No trend indicators in any screen (FV-05)", () => {
    const allDirs = [...getCoachDirs(), ...getAdminDirs()];
    const forbiddenComponents = [
      /<TrendArrow/,
      /<Sparkline/,
      /<TrendIndicator/,
      /<ProgressArrow/,
    ];

    allDirs.forEach((dir) => {
      getTsFiles(dir).forEach((file) => {
        const content = fs.readFileSync(file, "utf8");

        forbiddenComponents.forEach((pattern) => {
          expect(content).not.toMatch(pattern);
        });
      });
    });
  });

  test("No feedback colors in admin screens (FV-01, FV-02)", () => {
    const forbiddenColors = [
      "#4A7C59", // success green
      "#22c55e", // tailwind green
      "#C45B4E", // error red
      "#ef4444", // tailwind red
      "#f59e0b", // warning amber
    ];

    getAdminDirs().forEach((dir) => {
      getTsFiles(dir).forEach((file) => {
        const content = readFileFiltered(file);

        forbiddenColors.forEach((color) => {
          expect(content).not.toContain(color);
        });
      });
    });
  });
});
