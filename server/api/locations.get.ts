import { findLocations } from "~~/lib/db/queries/location";

export default defineAuthenticatedEventHandler(async (event) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return findLocations(event.context.user.id);
});
