import type { SelectLocationWithLogs } from "../../lib/db/schema/location";

export function useCurrentLocation() {
  const route = useRoute();

  const slug = computed(() => {
    const value = route.params.slug;
    return typeof value === "string" ? value : undefined;
  });

  return useFetch<SelectLocationWithLogs>(() =>
    `/api/locations/${slug.value}`, {
    key: `/api/locations/${slug.value}`,
    lazy: true,
    watch: false,
  });
}
