import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const path = join(process.cwd(), "types", "database.zod.ts");
let content = readFileSync(path, "utf-8");

const wrong = "z.record(z.union([jsonSchema, z.undefined()]))";
const fixed = "z.record(z.string(), z.union([jsonSchema, z.undefined()]))";

if (content.includes(wrong)) {
    content = content.replace(wrong, fixed);
    writeFileSync(path, content);
    console.log("✓ database.zod.ts: jsonSchema für Zod v4 gepatcht");
} else if (content.includes(fixed)) {
    console.log("✓ database.zod.ts: jsonSchema bereits gepatcht");
} else {
    console.warn("⚠ database.zod.ts: jsonSchema-Pattern nicht gefunden");
}
