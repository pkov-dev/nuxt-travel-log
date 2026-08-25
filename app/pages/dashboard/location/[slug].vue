<script lang="ts" setup>
const mapStore = useMapStore();

const {
  data: location,
  status,
  error,
} = useCurrentLocation();

watch(location, (newLocation) => {
  if (newLocation) {
    mapStore.detailedPoint = newLocation;
  }
}, {
  immediate: true,
});

onBeforeUnmount(() => {
  mapStore.detailedPoint = null;
});
</script>

<template>
  <div class="p-4 min-h-64">
    <div v-if="status === 'pending'">
      <div class="loading" />
    </div>
    <div v-if="location && status !== 'pending'">
      <h2 class="text-xl">
        {{ location.name }}
      </h2>
      <p class="text-sm">
        {{ location.description }}
      </p>
      <div v-if="!location.locationLogs.length" class="mt-4">
        <p class="text-sm italic">
          Add a location log to get started.
        </p>
        <button class="btn btn-primary mt-2">
          Add Location Log
          <Icon name="tabler:map-pin-plus" size="24" />
        </button>
      </div>
    </div>
    <div v-if="error && status !== 'pending'" class="alert alert-error">
      <h2 class="text-lg ">
        {{ error.statusText }}
      </h2>
    </div>
    <div>
      <NuxtPage />
    </div>
  </div>
</template>
