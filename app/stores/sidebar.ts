export const useSidebarStore = defineStore("sidebar", () => {
  const locationsStore = useLocationsStore();

  const sidebarItems = computed(() => {
    if (!locationsStore.locations?.length) {
      return [];
    }

    return locationsStore.locations.map(location => ({
      id: `location-${location.id}`,
      label: location.name,
      icon: "tabler:map-pin-filled",
      href: "#",
    }));
  });

  const loading = computed(() => locationsStore.status === "pending");

  return {
    loading,
    sidebarItems,
  };
});
