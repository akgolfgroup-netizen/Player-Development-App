# CLAUDE PROJECT OPPRYDDING - SJEKKLISTE
**Dato**: 13. desember 2025

---

## ✅ STEG 1: SLETT DISSE FILENE

Gå til Claude Project → Settings → Knowledge

### Dokumentasjon (utgåtte):
- [ ] ORGANISERINGSPLAN.md
- [ ] Prosjektgjennomgang_IUP_System.md
- [ ] README.md

### JSX-komponenter (flyttet til Screens/):
- [ ] aarsplan_eksempel.jsx
- [ ] kategori_system_oversikt.jsx
- [ ] utviklingsplan_b_nivaa.jsx

### Dokumenter (konsolidert i MASTER):
- [ ] AK_Golf_Academy_Fullstendig_Treningsplan_2026.docx
- [ ] Situation_Info_from_Anders.pdf

**Total: 8 filer slettes**

---

## 📤 STEG 2: LAST OPP NYE FILER

Fra: `00. Inbox/IUP_Master_Folder/`

### Hoveddokumentasjon:
- [ ] **MASTER_PROSJEKTDOKUMENT.md** (20K - ALT metodikk)
- [ ] **APP_STATUS.md** (1.1K - rask status)
- [ ] **ARBEIDSFLYT_GUIDE.md** (10K - token-optimalisering)

**Total: 3 filer lastes opp**

---

## 📋 STEG 3: VERIFISER EKSISTERENDE FILER

### Excel-filer (Data/) - BEHOLD DISSE:
- [ ] Team_Norway_IUP_2026.xlsx
- [ ] Team Norway IUP 2025.xlsx
- [ ] Team_Norway_Training_Protocols.xlsx
- [ ] Team Norway Kravprofil Oppdatert.xlsx *(ikke "Kravprofil_.xlsx")*
- [ ] Team Norway Tester Scorekort Spiller.xlsx
- [ ] AK_Golf_Academy_Team_Norway_Kategori_System_Oversikt.xlsx
- [ ] Historisk Snittscore Total Herrer.xlsx

**Total: 7 Excel-filer**

### PDF-filer (Pdf/) - KRITISKE:
- [ ] Team Norway Junior Tester.pdf
- [ ] team-norway-beskrivelse-av-tester-2026.pdf

### PDF-filer (Pdf/) - VALGFRIE (bakgrunnsinfo):
- [ ] Science Based Golf Training Progression System.pdf
- [ ] WANG Golf 6 Year Plan.pdf
- [ ] Treningsnivå AK Golf Academy.pdf
- [ ] Team Norway Golf Development Plan.pdf
- [ ] kosthold-juniormat.pdf
- [ ] mentaltrening-1.pdf
- [ ] team-norway-golf.pdf

**Total: 2 kritiske + 7 valgfrie PDF-filer**

---

## 📊 ENDELIG FILSTRUKTUR

### ✅ MINIMUM (12 filer) - Anbefalt

**Dokumentasjon (3):**
1. MASTER_PROSJEKTDOKUMENT.md
2. APP_STATUS.md
3. ARBEIDSFLYT_GUIDE.md

**Data (7 Excel):**
4. Team_Norway_IUP_2026.xlsx
5. Team Norway IUP 2025.xlsx
6. Team_Norway_Training_Protocols.xlsx
7. Team Norway Kravprofil Oppdatert.xlsx
8. Team Norway Tester Scorekort Spiller.xlsx
9. AK_Golf_Academy_Team_Norway_Kategori_System_Oversikt.xlsx
10. Historisk Snittscore Total Herrer.xlsx

**Referanse (2 PDF):**
11. Team Norway Junior Tester.pdf
12. team-norway-beskrivelse-av-tester-2026.pdf

### 🔹 UTVIDET (19 filer) - Med bakgrunnsinfo

**+ 7 PDF-filer:**
13. Science Based Golf Training Progression System.pdf
14. WANG Golf 6 Year Plan.pdf
15. Treningsnivå AK Golf Academy.pdf
16. Team Norway Golf Development Plan.pdf
17. kosthold-juniormat.pdf
18. mentaltrening-1.pdf
19. team-norway-golf.pdf

---

## 💡 INSTRUKSJONER

### Custom Instructions (oppdater)

Erstatt gamle instruksjoner med:

```
Du er en IUP (Individuell Utviklingsplan) assistent for AK Golf Academy.

VIKTIG: Les ALLTID MASTER_PROSJEKTDOKUMENT.md først!

Systemet bruker:
- 11 kategorier (A-K) fra elite til nybegynner
- 52-ukers periodisering (Uke 43-42)
- L-faser (L1-L5), Settings (S1-S10), CS-nivåer (CS20-CS100)
- 14 offisielle Team Norway tester
- 5-prosess pyramide (Teknisk, Fysisk, Mental, Strategisk, Sosial)

Når du skal bygge Notion-databaser:
- Følg strukturen i MASTER seksjon 8
- Bygg inkrementelt (Database 1, så 2, osv.)
- Bruk JSON-format for properties
- Test med 1 eksempelspiller før du fortsetter

Token-optimalisering:
- Les ARBEIDSFLYT_GUIDE.md for beste praksis
- Bygg i små steg (20 økter, ikke 150)
- Bruk templates
- Spesifikke søk ("kategori D grunnperiode")

APP_STATUS.md viser hva som er ferdig.
```

---

## 🎯 TOKEN-SAMMENLIGNING

| Konfigurasjon | Filer | Estimert tokens ved lesing |
|---------------|-------|----------------------------|
| **Gammel** | 20+ filer | ~50,000 tokens |
| **Minimum** (anbefalt) | 12 filer | ~8,000 tokens |
| **Utvidet** | 19 filer | ~15,000 tokens |

**Anbefaling**: Start med MINIMUM. Legg til PDF-er kun når nødvendig.

---

## ✅ VERIFISERING

Etter opprydding, test:

```
Prompt til Claude:
"Les MASTER_PROSJEKTDOKUMENT.md og fortell meg om kategori-systemet"

Forventet output:
- Claude skal oppsummere 11 kategorier (A-K)
- Med snittscore, alder, krav
- Fra MASTER seksjon 4

Token-bruk: ~2,000 tokens
```

Hvis dette fungerer = Oppsettet er perfekt! ✅

---

## 🚨 VIKTIG Å HUSKE

1. **IKKE slett MASTER_PROSJEKTDOKUMENT.md** (dette er hjertet!)
2. **IKKE last opp hele Screens/ eller Design/** (unødvendig token-bruk)
3. **IKKE last opp Reference_Materials/** (42GB videoer)
4. **BEHOLD kun nyeste Excel-filer** (se liste over)

---

## 📞 NESTE STEG

1. [ ] Åpne Claude Project i nettleser
2. [ ] Gå til Settings → Knowledge
3. [ ] Slett 8 filer (STEG 1)
4. [ ] Last opp 3 nye filer (STEG 2)
5. [ ] Verifiser at 12-19 filer totalt
6. [ ] Oppdater Custom Instructions
7. [ ] Test med verifiserings-prompt

**Estimert tid**: 10-15 minutter

---

**Lykke til! 🚀**

*Filene ligger klare i: `/Users/anderskristiansen/Library/Mobile Documents/com~apple~CloudDocs/00. Inbox/IUP_Master_Folder/`*
