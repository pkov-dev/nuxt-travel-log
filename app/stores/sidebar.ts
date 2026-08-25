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
  const { data: currentLocation } = useCurrentLocation();

  const sidebarTopItems = computed<SidebarItem[]>(() => {
    if (route.name === "dashboard") {
      return [
        {
          id: "link-dashboard",
          label: "Locations",
          href: "/dashboard",
          icon: "tabler:map",
        },
        {
          id: "link-location-add",
          label: "Add Location",
          href: "/dashboard/add",
          icon: "tabler:circle-plus-filled",
        },
      ];
    }

    if (route.name === "dashboard-location-slug") {
      return [
        {
          id: "link-dashboard",
          label: "Back to Locations",
          href: "/dashboard",
          icon: "tabler:arrow-left",
        },
        {
          id: "link-current-edit",
          label: "Edit Location",
          to: {
            name: "dashboard-location-slug-edit",
            params: {
              slug: route.params.slug,
            },
          },
          icon: "tabler:map-pin-cog",
        },
        {
          id: "link-current-location",
          label: currentLocation.value?.name ?? "View Logs",
          to: {
            name: "dashboard-location-slug",
            params: {
              slug: route.params.slug,
            },
          },
          icon: "tabler:map",
        },
        {
          id: "link-location-add",
          label: "Add Location Log",
          to: {
            name: "dashboard-location-slug-add",
            params: {
              slug: currentLocation.value?.slug,
            },
          },
          icon: "tabler:circle-plus-filled",
        },
      ];
    }

    return [];
  });

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
