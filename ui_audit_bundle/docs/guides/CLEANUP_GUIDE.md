# Project Cleanup Guide

> Guide for cleaning up legacy files and organizing the project
> **For**: Project maintainers ready to clean up after development
> **Date**: December 16, 2025

---

## ⚠️ READ THIS FIRST

This project contains several **legacy folders and files** from earlier development iterations. This guide helps you understand what can be safely deleted and what must be kept.

**IMPORTANT**: Before deleting anything, ensure you have:
1. ✅ Committed all important code to git
2. ✅ Backed up the project
3. ✅ Verified the current system works

---

## 🗑️ Safe to Delete (Legacy/Unused)

### Folders - Can Delete Completely

```bash
# ⚠️ Legacy Express Backend (replaced by apps/api)
/backend/                     # DELETE - Old Express backend
  ├── src/
  ├── node_modules/
  └── package.json

# ⚠️ Old Workspaces (no longer used)
/IUP_Master_Folder/           # DELETE - Old development workspace
  ├── backend/
  └── various files/

/IUP_Master_Folder_2/         # DELETE - Old build artifacts
  ├── FINAL_BUILD_SUMMARY.md
  ├── FRONTEND_COMPLETE_SUMMARY.md
  └── SYSTEM_READY.md

# ⚠️ Old Reference Files
/files/                       # DELETE - Old documentation
  └── AK_Golf_Booking_System_Backend_Documentation.md

/reference/                   # DELETE - Old reference materials

# ⚠️ Unused Data Folders (if empty or irrelevant)
/packages/                    # DELETE if empty
/services/                    # DELETE if empty
```

### Files - Can Delete

```bash
# Legacy Scripts
CLEANUP_SCRIPT.sh            # DELETE - Old cleanup script
SAFE_CLEANUP_SCRIPT.sh       # DELETE - Old cleanup script
backup-script.sh             # DELETE - Manual backup script
export-app.sh                # DELETE - Old export script

# Static HTML Prototypes
ak-golf-app-complete.html    # DELETE - Static prototype
/apps/web/src/components/ak-golf-interactive-app.html  # DELETE

# Old Status Files (info now in README.md)
APP_STATUS.md                # DELETE - Outdated, use README.md
Skill.toml                   # DELETE if not using Skills

# Duplicate Documentation (consolidated)
QUICKSTART.md                # DELETE - Use /apps/api/QUICK_START.md
```

---

## ✅ Must Keep (Active/Important)

### Active Application Folders

```bash
# ⭐ KEEP - Main apps/web
/apps/web/                    # KEEP - React apps/web (ACTIVE)
  ├── src/
  ├── public/
  └── package.json

# ⭐ KEEP - Main Backend
/apps/api/             # KEEP - Fastify backend (ACTIVE)
  ├── src/
  ├── prisma/
  ├── tests/
  └── package.json

# ⭐ KEEP - Design System
/packages/design-system/                      # KEEP - Design System v2.1
  ├── figma/
  └── tokens/

# ⭐ KEEP - Documentation
/docs/                        # KEEP - All documentation
  ├── 00_MASTER_PROSJEKTDOKUMENT.md
  ├── 01_STATUS_DASHBOARD.md
  └── ... (all .md files)

# ⭐ KEEP - Reference Data
/data/                        # KEEP - Test specs, exercises
  ├── tests/
  ├── exercises/
  └── categories/

# ⭐ KEEP - Utilities
/scripts/                     # KEEP - Utility Scripts
  ├── cleanup-docs.sh
  └── localstack-init.sh

/packages/database/                    # KEEP - Database utilities
```

### Important Files

```bash
# Root Configuration
README.md                     # KEEP - Main documentation
PROJECT_STRUCTURE.md          # KEEP - Architecture guide
AUTHENTICATION_COMPLETE.md    # KEEP - Auth documentation
INTEGRATION_COMPLETE.md       # KEEP - Integration guide
DESIGN_SOURCE_OF_TRUTH.md     # KEEP - Design system
CLEANUP_GUIDE.md              # KEEP - This file

.gitignore                    # KEEP - Git ignore rules
package.json                  # KEEP - Root package config
pnpm-workspace.yaml           # KEEP - pnpm workspace
docker-compose.yml            # KEEP - Docker orchestration
tsconfig.json                 # KEEP - TypeScript config
turbo.json                    # KEEP - Turbo config
vitest.config.ts              # KEEP - Test config
.env.example                  # KEEP - Environment template
```

---

## 🧹 Cleanup Commands

### Option 1: Manual Cleanup (Recommended First Time)

```bash
# Navigate to project root
cd "/Users/anderskristiansen/Library/Mobile Documents/com~apple~CloudDocs/01. Projects/Active/IUP_Master_V1"

# Delete legacy backend
rm -rf backend/

# Delete old workspaces
rm -rf IUP_Master_Folder/
rm -rf IUP_Master_Folder_2/

# Delete old reference files
rm -rf files/
rm -rf reference/

# Delete empty folders (if they exist)
rm -rf packages/
rm -rf services/

# Delete legacy Scripts
rm -f CLEANUP_SCRIPT.sh
rm -f SAFE_CLEANUP_SCRIPT.sh
rm -f backup-script.sh
rm -f export-app.sh

# Delete static HTML prototypes
rm -f ak-golf-app-complete.html
rm -f apps/web/src/components/ak-golf-interactive-app.html

# Delete outdated docs
rm -f APP_STATUS.md
rm -f Skill.toml
rm -f QUICKSTART.md
```

### Option 2: Automated Cleanup Script

Save this as `cleanup.sh`:

```bash
#!/bin/bash

echo "🧹 Cleaning up IUP Golf Academy project..."
echo ""

# Safety check
echo "⚠️  This will delete legacy files and folders."
read -p "Are you sure? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo "Cleanup cancelled."
  exit 0
fi

# Delete legacy folders
echo "Deleting legacy folders..."
rm -rf backend/
rm -rf IUP_Master_Folder/
rm -rf IUP_Master_Folder_2/
rm -rf files/
rm -rf reference/
rm -rf packages/
rm -rf services/

# Delete legacy Scripts
echo "Deleting legacy Scripts..."
rm -f CLEANUP_SCRIPT.sh
rm -f SAFE_CLEANUP_SCRIPT.sh
rm -f backup-script.sh
rm -f export-app.sh

# Delete HTML prototypes
echo "Deleting HTML prototypes..."
rm -f ak-golf-app-complete.html
rm -f apps/web/src/components/ak-golf-interactive-app.html

# Delete outdated docs
echo "Deleting outdated documentation..."
rm -f APP_STATUS.md
rm -f Skill.toml
rm -f QUICKSTART.md

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "Kept:"
echo "  - apps/web/ (React app)"
echo "  - apps/api/ (Fastify API)"
echo "  - packages/design-system/ (Design System)"
echo "  - docs/ (Documentation)"
echo "  - data/ (Reference data)"
echo "  - All configuration files"
echo ""
echo "Next: Review changes and commit to git if happy."
```

Run with:
```bash
chmod +x cleanup.sh
./cleanup.sh
```

---

## 📊 Disk Space Savings

Expected savings after cleanup:

```
backend/           ~200-500 MB (node_modules)
IUP_Master_Folder/ ~100-300 MB
IUP_Master_Folder_2/ ~50-100 MB
files/             ~10-20 MB
reference/         ~10-20 MB
Legacy Scripts     <1 MB
HTML files         <1 MB

Total savings: ~400-1000 MB
```

---

## 🔍 Before You Delete - Checklist

- [ ] Project is backed up (git committed or copied)
- [ ] Current apps/web works (http://localhost:3001)
- [ ] Current backend works (http://localhost:3000)
- [ ] Database is seeded and accessible
- [ ] All tests pass (`npm test`)
- [ ] Documentation is readable and accurate
- [ ] Team is aware of cleanup

---

## 📂 After Cleanup - Folder Structure

```
IUP_Master_V1/
├── apps/web/              # ✅ React apps/web
├── apps/api/       # ✅ Fastify backend
├── packages/design-system/                # ✅ Design System
├── docs/                  # ✅ Documentation
├── data/                  # ✅ Reference data
├── scripts/               # ✅ Utility Scripts
├── Database/              # ✅ Database utilities
│
├── README.md              # ✅ Main docs
├── PROJECT_STRUCTURE.md   # ✅ Architecture
├── AUTHENTICATION_COMPLETE.md
├── INTEGRATION_COMPLETE.md
├── DESIGN_SOURCE_OF_TRUTH.md
├── CLEANUP_GUIDE.md       # ✅ This file
│
├── .gitignore
├── package.json
├── pnpm-workspace.yaml
├── docker-compose.yml
└── ... (config files)
```

**Total folders**: 7 (down from 12+)
**Clean, organized, professional** ✨

---

## 🎯 Post-Cleanup Tasks

After cleanup:

1. **Update README.md** if needed
2. **Commit changes**:
   ```bash
   git add .
   git commit -m "chore: cleanup legacy files and folders"
   ```
3. **Verify everything still works**:
   ```bash
   cd apps/api && npm run dev
   cd apps/web && npm start
   ```
4. **Update documentation** if paths changed
5. **Inform team** of new structure

---

## ⚠️ If Something Breaks

If you deleted something important:

1. **Check git history**:
   ```bash
   git log --oneline
   git checkout <commit-hash> -- <file-path>
   ```

2. **Restore from backup** if you made one

3. **Contact**: Original developer or check documentation

---

## 📝 Notes

- **backend/** was replaced by **apps/api/** (Fastify is faster, more modern)
- **IUP_Master_Folder/** was an early workspace (pre-monorepo structure)
- **APP_STATUS.md** is outdated - current status is in README.md
- Static HTML files were early prototypes, now replaced by React components

---

**After cleanup, your project will be cleaner, smaller, and easier to navigate! 🚀**
