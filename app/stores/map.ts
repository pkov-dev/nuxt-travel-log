export const useMapStore = defineStore("map", () => {
  const selectedPoint = ref<MapPoint | null>(null);
  const detailedPoint = ref<MapPoint | null>(null);
  const addedPoint = ref<MapPoint & { centerMap?: boolean; zoom?: number } | null>(null);
  const locationsStore = useLocationsStore();

  const mapPoints = computed<MapPoint[]>(() => {
    if (detailedPoint.value) {
      return [detailedPoint.value];
    }

    if (!locationsStore.locations?.length) {
      return [];
    }

    return locationsStore.locations.map(location => ({
      ...location,
      to: {
        name: "dashboard-location-slug" as const,
        params: { slug: location.slug },
      },
      toLabel: "View",
    }));
  });

  return {
    mapPoints,
    selectedPoint,
    detailedPoint,
    addedPoint,
  };
});
