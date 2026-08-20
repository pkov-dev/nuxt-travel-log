import { findLocationByName, findUniqueSlug, insertLocation } from "~~/lib/db/queries/location";
import { InsertLocation } from "~~/lib/db/schema";
import { DrizzleQueryError } from "drizzle-orm";
import slugify from "slug";

import sendZodError from "../utils/send-zod-error";

export default defineAuthenticatedEventHandler(async (event) => {
  const result = await readValidatedBody(event, InsertLocation.safeParse);

  if (!result.success) {
    sendZodError(result.error);
  }

  const existingLocation = await findLocationByName(result.data, event.context.user.id);

  if (existingLocation) {
    throw createError({
      statusCode: 422,
      statusMessage: "A location with that name already exists!",
    });
  }

  const slug = await findUniqueSlug(slugify(result.data.name));

  try {
    return insertLocation(result.data, slug, event.context.user.id);
  }
  catch (error) {
    if (error instanceof DrizzleQueryError) {
      if (error.cause?.message === "SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: location.slug") {
        throw createError({
          statusCode: 409,
          statusMessage: "Slug must be unique (the location name is used to generate the slug)",
        });
      }
    }
    throw error;
  }
});
