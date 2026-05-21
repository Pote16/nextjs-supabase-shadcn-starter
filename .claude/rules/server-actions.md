---
paths:
    - 'app/**/actions.ts'
    - 'app/**/*-actions.ts'
    - 'lib/safe-action.ts'
    - 'lib/safe-action-utils.ts'
---

# Server Actions Patterns (next-safe-action v8)

Wenn du in einer Server-Action-Datei arbeitest, halte dich strikt an folgendes Schema.

## Datei-Header

```typescript
'use server';

import { z } from 'zod';

import { authActionClient } from '@/lib/safe-action';
```

## Action-Definition

```typescript
export const createOrder = authActionClient
    .metadata({ actionName: 'createOrder' })
    .inputSchema(
        z.object({
            customerId: z.string().uuid(),
            items: z.array(z.object({ sku: z.string(), quantity: z.number().int().positive() })),
        }),
    )
    .action(async ({ parsedInput, ctx }) => {
        const { customerId, items } = parsedInput;
        const { supabase, userId } = ctx;

        const { data, error } = await supabase
            .from('orders')
            .insert({ customer_id: customerId, created_by: userId })
            .select()
            .single();

        if (error) throw new ActionError('Bestellung konnte nicht angelegt werden');

        return { orderId: data.id };
    });
```

## Regeln

1. **Immer** `authActionClient` (User-Auth) oder `adminActionClient` (Admin-Auth). Niemals der base `actionClient` für mutierende Operationen.
2. **Immer** `.metadata({ actionName })` setzen — für Logging und Observability.
3. **Immer** `.inputSchema(z.object({...}))` (v8 API). NICHT `.schema()`.
4. **Immer** `ctx.supabase` nutzen — nicht `createClient()` manuell aufrufen.
5. **Fehler** über `throw new ActionError('Klartext-Message')` werfen. Nie raw error throwen — sonst leakt das in Production.
6. **Output-Schema** bei sensitiven Returns: `.outputSchema(z.object({...}))` — strippt unbekannte Felder.

## Client-Konsum

```typescript
'use client';
import { useAction } from 'next-safe-action/hooks';
import { createOrder } from './actions';

export function CreateOrderButton() {
    const { execute, isPending } = useAction(createOrder);
    // ...
}
```

## Verbote

- Kein direkter `process.env.*` Zugriff in Actions — nutze `@/lib/env`.
- Keine `console.log` — `console.error` für Fehler, sonst nichts.
- Kein `.schema()` (deprecated). Immer `.inputSchema()`.
- Keine raw Supabase-Fehler an den Client leaken — `ActionError` als Filter.
