---
name: publish
description: Führt develop in main zusammen, pusht main (Deploy) und wechselt zurück zu develop. Nur ausführen wenn der Nutzer explizit /publish aufruft und wenn lokaler develop und origin/develop auf dem gleichen Stand sind.
disable-model-invocation: true
---

# Publish (develop → main, Deploy)

Merge von `develop` nach `main`, Push (löst Deployment aus), danach zurück zu `develop`.

## Vorbedingung (zwingend prüfen)

**Nur ausführen, wenn lokaler Branch `develop` und `origin/develop` auf dem gleichen Stand sind.**

1. **Remote-Stand holen:** Zuerst `git fetch origin` ausführen, damit ahead/behind stimmt.
2. **Aktueller Branch:** Muss `develop` sein.
3. **Sync mit origin/develop:**
    - Weder „Your branch is ahead of 'origin/develop'“ (sonst zuerst `git push origin develop`).
    - Weder „Your branch is behind 'origin/develop'“ (sonst zuerst `git pull origin develop`).

**Nicht synchron:** Abbrechen, Nutzer informieren: zuerst push/pull auf develop, dann `/publish` erneut.

**Uncommittete Änderungen:** Entweder abbrechen und committen (ggf. pushen) dann erneut `/publish`, oder Nutzer fragen ob er die Änderungen vorher committen will. Nicht mit schmutzigem Arbeitsbaum mergen, wenn unklar ist ob die Änderungen mit nach main sollen.

**Optional vor dem Merge (Best Practice):** Auf `develop` einmal `pnpm build` (und ggf. `pnpm typecheck`) ausführen. Bei Fehlern abbrechen – so wird nichts Kaputtes nach main gemergt.

## Ablauf (wenn Vorbedingung erfüllt)

1. **Sync prüfen:** wie oben (inkl. `git fetch origin`).
2. **main auschecken:** `git checkout main` → `git pull origin main`.
3. **develop mergen:** `git merge develop -m "Merge develop into main for production deploy"`.
    - **Bei Merge-Konflikten:** `git merge --abort`, Nutzer bitten Konflikte auf develop zu lösen, dann `/publish` erneut.
4. **main pushen (Deploy):** `git push origin main`.
    - **Falls Push abgelehnt wird (z. B. geschützter main):** Nutzer hinweisen, dass er den Merge per Pull Request auf GitHub durchführen muss.
5. **Zurück zu develop:** `git checkout develop`.

Optional am Ende erwähnen: Bei Bedarf `git push origin develop`, falls Commits auf develop noch nicht gepusht waren.
