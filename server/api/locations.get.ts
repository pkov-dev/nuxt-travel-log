import { findLocations } from "~~/lib/db/queries/location";

export default defineAuthenticatedEventHandler((event) => {
  return findLocations(event.context.user.id);
});
