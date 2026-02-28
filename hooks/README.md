# `/hooks` Verzeichnis

Dieser Ordner enthält benutzerdefinierte React Hooks (`use...`) zur Wiederverwendung von Logik über verschiedene Komponenten hinweg.

## Architektur & Richtlinien:

1. **Trennung von Hooks und Utilities:**
   - Hooks binden Reacts Lebenszyklus (`useState`, `useEffect`) ein.
   - Wenn eine Funktion rein logisch ist und keinen React-Zustand benötigt, gehört sie in `/utils` oder `/lib`.

2. **TanStack Query Hooks:**
   Schreibe benutzerdefinierte Query-Hooks, anstatt `useQuery` quer im Projekt zu verteilen:
   - Beispiel: `export const useOrders = () => useQuery({ queryKey: ['orders'], queryFn: fetchOrders })`

3. **Performance:**
   - Achte auf Memoization in Hooks (`useMemo`, `useCallback`), insbesondere, wenn sie als Dependency in anderen Hooks genutzt werden.
