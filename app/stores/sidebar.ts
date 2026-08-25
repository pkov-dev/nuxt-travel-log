import type { RouteLocationRaw } from "vue-router";

type SidebarItem = {
  id: string;
  label: string;
  icon: string;
  href?: string;
  to?: RouteLocationRaw;
  mapPoint?: MapPoint;
};

const listLocationsInSidebar = new Set(["dashboard", "dashboard-add"]);
// const listCurrentLocationInSidebar = new Set(["dashboard-location-slug", "dashboard-location-slug-edit", "dashboard-location-slug-add"]);

export const useSidebarStore = defineStore("sidebar", () => {
  const locationsStore = useLocationsStore();
  const route = useRoute();

  const sidebarItems = computed<SidebarItem[]>(() => {
    if (!locationsStore.locations?.length || !listLocationsInSidebar.has(route.name?.toString() || "")) {
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
    sidebarTopItems,
  };
});
