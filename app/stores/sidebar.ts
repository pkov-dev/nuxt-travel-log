import type { RouteLocationRaw } from "vue-router";

import { LOCATION_PAGES } from "~~/lib/constants";

type SidebarItem = {
  id: string;
  label: string;
  icon: string;
  href?: string;
  to?: RouteLocationRaw;
  mapPoint?: MapPoint;
};

export const useSidebarStore = defineStore("sidebar", () => {
  const locationsStore = useLocationsStore();
  const route = useRoute();

  const sidebarItems = computed<SidebarItem[]>(() => {
    if (!locationsStore.locations?.length || !LOCATION_PAGES.has(route.name?.toString() || "")) {
      return [];
    }

    return locationsStore.locations.map(location => ({
      id: `location-${location.id}`,
      label: location.name,
      icon: "tabler:map-pin-filled",
      to: { name: "dashboard-location-slug", params: { slug: location.slug } },
      mapPoint: createMapPointFromLocation(location),
    }));
  });

  const loading = computed(() => locationsStore.status === "pending");

  return {
    loading,
    sidebarItems,
  };
});
