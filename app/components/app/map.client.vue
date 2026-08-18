<script setup lang="ts">
import { CENTER_UK } from "~~/lib/constants";
import { LngLatBounds } from "maplibre-gl";

const mapStore = useMapStore();
const mapRef = useMglMap();

const colorMode = useColorMode();
const style = computed(() => colorMode.value === "dark" ? "/styles/dark.json" : "https://tiles.openfreemap.org/styles/liberty");

const zoom = 4;

function fitMapToPoints(points: MapPoint[]) {
  const map = mapRef.map;

  if (!map || !points.length) {
    return;
  }

  const bounds = new LngLatBounds();

  points.forEach((point) => {
    bounds.extend([point.long, point.lat]);
  });

  map.fitBounds(bounds, {
    padding: 50,
    maxZoom: 14,
  });
}

watch(
  () => mapStore.mapPoints,
  (points) => {
    if (!mapRef.isLoaded || !points.length) {
      return;
    }
    fitMapToPoints(points);
  },
);

watch(
  () => mapRef.isLoaded,
  (loaded) => {
    if (loaded && mapStore.mapPoints.length) {
      fitMapToPoints(mapStore.mapPoints);
    }
  },
);
</script>

<template>
  <div class="h-full min-h-80 w-full">
    <MglMap
      :map-style="style"
      :center="CENTER_UK"
      :zoom="zoom"
      height="100%"
      width="100%"
    >
      <MglNavigationControl />
      <MglMarker
        v-for="point in mapStore.mapPoints"
        :key="point.id"
        :coordinates="[point.long, point.lat]"
      >
        <template #marker>
          <div class="tooltip tooltip-top" :data-tip="point.label">
            <Icon
              name="tabler:map-pin-filled"
              size="30"
              class="text-secondary"
            />
          </div>
        </template>
      </MglMarker>
    </MglMap>
  </div>
</template>
