import { db } from "./src/db/index.ts";
import { visits, integrados } from "./src/db/schema.ts";

async function test() {
  const v = await db.select().from(visits).limit(1);
  console.log("Visits:", v);
  const i = await db.select().from(integrados).limit(1);
  console.log("Integrados:", i);
  process.exit(0);
}
test();
