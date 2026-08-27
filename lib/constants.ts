import type { LngLatLike } from "maplibre-gl";

export const CENTER_UK: LngLatLike = [30.5234, 50.4501];

export const LOCATION_PAGES = new Set(["dashboard", "dashboard-add"]);
export const CURRENT_LOCATION_PAGES = new Set([
  "dashboard-location-slug",
  "dashboard-location-slug-edit",
  "dashboard-location-slug-add",
]);
export const EDIT_PAGES = new Set([
  "dashboard-add",
  "dashboard-location-slug-edit",
  "dashboard-location-slug-add",
]);
