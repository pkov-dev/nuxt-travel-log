<script lang="ts" setup>
import type { InsertLocation } from "~~/lib/db/schema";

const { $csrfFetch } = useNuxtApp();
const { data: currentLocation, status: currentLocationStatus } = useCurrentLocation();
const route = useRoute();

async function onSubmit(values: InsertLocation) {
  await $csrfFetch(`/api/locations/${route.params.slug}`, {
    method: "PUT",
    body: values,
  });
}

function onSubmitComplete() {
  navigateTo({
    name: "dashboard-location-slug",
    params: {
      slug: route.params.slug,
    },
  });
}
</script>

<template>
  <LocationForm
    v-if="currentLocationStatus !== 'pending'"
    :on-submit
    :on-submit-complete
    :initial-values="currentLocation"
    submit-label="Edit"
    submit-icon="tabler:map-pin-up"
  />
</template>
