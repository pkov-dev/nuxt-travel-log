export const useMapStore = defineStore("map", () => {
  const locationsStore = useLocationsStore();

  const mapPoints = computed(() => {
    if (!locationsStore.locations?.length) {
      return [];
    }

    return locationsStore.locations.map(location => ({
      id: location.id,
      label: location.name,
      lat: location.lat,
      long: location.long,
    }));
  });

  return {
    mapPoints,
  };
});
