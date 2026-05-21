# `/utils` Verzeichnis

In diesem Order befinden sich funktionale, von Reacts Render-Zyklus unabhängige, pure TypeScript-Helfer.

Beispiele:

- String-, Datums- oder Nummern-Formatierer (e.g. `formatDate`, `formatCurrency`).
- `cn()` Utility (Tailwind Merge via `clsx` und `tailwind-merge`), wird standardmäßig von shadcn verwendet.

Wenn eine Funktion State oder React Lifecycles benötigt, gehört sie nach `/hooks`.
Wenn eine Funktion eine externe API koppelt, gehört sie eher nach `/lib`.
