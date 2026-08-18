export const useLocationsStore = defineStore("locations", () => {
  const { data: locations, status, refresh } = useLazyFetch("/api/locations");

  return {
    locations,
    status,
    refresh,
  };
});
