---
trigger: model_decision
description: "when working on UI components or styling"
---

# Theme-Farben (Tailwind v4 / shadcn)

Bei neuen oder geänderten UI-Komponenten diese Token-Regeln einhalten.

## Hierarchie

- **Light:** Hintergrund hellgrau, Card reinweiß.
- **Dark:** Hintergrund dunkelste Ebene, Card eine Stufe heller.

## Token-Zuordnung

- **Seiten-Hintergrund / Scroll-Container von Tabellen:** `bg-background`.
- **Header:** `bg-background` (ggf. + `backdrop-blur` bei sticky).
- **Sidebar:** `bg-sidebar`.
- **Karten, Tabellen, Board-Zeilen, Sheet, Dialog:** `bg-card` + `border border-border`.
- **Menüs (Dropdown, Popover, …):** `bg-popover`.
- **Secondary:** `bg-muted` / `bg-secondary`.

## Semantische Tokens (Warning / Info / Error / Success)

Nutze die Standard-Bezeichner (wenn in `globals.css` definiert):
- `bg-destructive` / `text-destructive-foreground` für Fehler/Gefahr.
- `bg-accent` für Hervorhebungen.
