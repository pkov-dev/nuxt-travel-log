import type { InsertLocationLog } from "~~/lib/db/schema";

import db from "~~/lib/db";
import { locationLog } from "~~/lib/db/schema";

export async function insertLocationLog(locationId: number, values: InsertLocationLog, userId: number) {
  const [inserted] = await db.insert(locationLog).values({
    ...values,
    userId,
    locationId,
  }).returning();

  return inserted;
}
