export const useMapStore = defineStore("map", () => {
  const selectedPoint = ref<MapPoint | null>(null);
  const locationsStore = useLocationsStore();

  const mapPoints = computed(() => {
    if (!locationsStore.locations?.length) {
      return [];
    }
    return locationsStore.locations;

    // return locationsStore.locations.map(location => ({
    //   id: location.id,
    //   name: location.name,
    //   lat: location.lat,
    //   long: location.long,
    //   description: location.description,
    // }));
  });

  return {
    mapPoints,
    selectedPoint,
  };
});
