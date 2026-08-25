export function useCurrentLocation() {
  const route = useRoute();

  const slug = computed(() => route.params.slug);
  return useFetch(() =>
    `/api/locations/${slug.value}`, {
    lazy: true,
    watch: false,
  });
}
