export const useLocationsStore = defineStore("locations", () => {
  const { data: locations, status, refresh } = useLazyFetch("/api/locations");

  const sidebarItems = computed(() => {
    if (!locations.value) {
      return [];
    }

    return locations.value.map(location => ({
      id: `location-${location.id}`,
      label: location.name,
      icon: "tabler:map-pin-filled",
      href: "#",
    }));
  });

  return {
    locations,
    sidebarItems,
    status,
    refresh,
  };
});
