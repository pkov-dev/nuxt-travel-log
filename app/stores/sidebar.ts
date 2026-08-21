import type { SelectLocation } from "~~/lib/db/schema";
import type { RouteLocationRaw } from "vue-router";

type SidebarItem = {
  id: string;
  label: string;
  icon: string;
  to: RouteLocationRaw;
  location: SelectLocation;
};

export const useSidebarStore = defineStore("sidebar", () => {
  const locationsStore = useLocationsStore();

  const sidebarItems = computed<SidebarItem[]>(() => {
    if (!locationsStore.locations?.length) {
      return [];
    }

    return locationsStore.locations.map(location => ({
      id: `location-${location.id}`,
      label: location.name,
      icon: "tabler:map-pin-filled",
      to: { name: "dashboard-location-slug", params: { slug: location.slug } },
      location: {
        ...location,
        to: { name: "dashboard-location-slug", params: { slug: location.slug } },
        toLabel: "View",
      },
    }));
  });

  const loading = computed(() => locationsStore.status === "pending");

  return {
    loading,
    sidebarItems,
  };
});
