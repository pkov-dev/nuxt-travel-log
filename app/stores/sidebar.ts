import type { RouteLocationRaw } from "vue-router";

type SidebarItem = {
  id: string;
  label: string;
  icon: string;
  to: RouteLocationRaw;
  mapPoint: MapPoint;
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
      mapPoint: createMapPointFromLocation(location),
    }));
  });

  const loading = computed(() => locationsStore.status === "pending");

  return {
    loading,
    sidebarItems,
  };
});
