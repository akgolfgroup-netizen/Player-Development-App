IUP MASTER V1 - KODEBASE EKSPORT
================================

Dato: $(date +%Y-%m-%d\ %H:%M:%S)

INNHOLD
-------

ALTERNATIV 1 - Fullstendig eksport:
  • IUP_FULL_REPO.zip
    └─ Hele repoet minus node_modules/build/dist/video

ALTERNATIV 2 - Modulær eksport:
  • 1_BACKEND_API.zip       - API-kode, routes, services, middleware
  • 2_DATAMODELL.zip        - Prisma schema, migrations, seeds
  • 3_WEB_FRONTEND.zip      - Next.js app, components, features
  • 4_MOBILE_APP.zip        - Ionic/Capacitor app (hvis tilgjengelig)
  • 5_ROOT_CONFIG.zip       - package.json, turbo.json, docker-compose.yml
  • 6_DOCUMENTATION.zip     - docs/ katalog
  • 7_PACKAGES.zip          - Shared packages (database, design-system)
  • 8_SCRIPTS.zip           - Build/deploy scripts, CI/CD

EKSKLUDERT
----------
  • node_modules/
  • .next/, dist/, build/
  • .turbo/, coverage/
  • .git/ (versjonskontroll)
  • Video-filer (*.mp4, *.mov)
  • Hemmelige .env-filer (kun .env.example inkludert)

NEXT STEPS
----------
1. Pakk ut relevant ZIP(er)
2. Installer avhengigheter: pnpm install
3. Kopier .env.example → .env og konfigurer
4. Kjør database: docker-compose up -d postgres
5. Migrer database: cd apps/api && npx prisma migrate deploy
6. Start dev: pnpm dev

KONTAKT
-------
Repo: /Users/anderskristiansen/Developer/IUP_Master_V1
