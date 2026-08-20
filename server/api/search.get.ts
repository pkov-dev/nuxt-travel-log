import type { NominatimResult } from "~~/shared/types";

import { SearchSchema } from "~~/lib/zod-schemas";

export default defineAuthenticatedEventHandler(
  defineCachedEventHandler(async (event) => {
    const result = await getValidatedQuery(event, SearchSchema.safeParse);

    if (!result.success) {
      sendZodError(result.error);
    }

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${result.data.q}&format=json`, {
        signal: AbortSignal.timeout(5000),
        headers: {
          "User-Agent": "TravelLog/1.0 (contact: pashko.dev@gmail.com)",
        },
      });
      if (!response.ok) {
        throw createError({
          statusCode: 504,
          statusMessage: "Unable to reach search API.",
        });
      }
      const results = await response.json() as NominatimResult[];
      return results;
    }
    catch (error) {
      console.error(error);
      throw error;
    }
  }, {
    maxAge: 60 * 60 * 24,
    name: "search-nominatim",
    getKey: (event) => {
      const { q } = getQuery(event);
      return q?.toString() || "";
    },
  }),
);
