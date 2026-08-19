<script setup lang="ts">
import { CENTER_UK } from "~~/lib/constants";
import { LngLatBounds } from "maplibre-gl";

const mapStore = useMapStore();
const mapRef = useMglMap();

const colorMode = useColorMode();
const style = computed(() => colorMode.value === "dark" ? "/styles/dark.json" : "https://tiles.openfreemap.org/styles/liberty");

const zoom = 4;
const shouldFlyTo = ref(true);

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

function selectPointWithoutFlyTo(point: MapPoint) {
  shouldFlyTo.value = false;
  mapStore.selectedPoint = point;
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
watch(() => mapStore.selectedPoint, (selectedPoint) => {
  if (!shouldFlyTo.value) {
    shouldFlyTo.value = true;
    return;
  }

  if (!selectedPoint) {
    fitMapToPoints(mapStore.mapPoints);
    return;
  }

  mapRef.map?.flyTo({
    center: [selectedPoint.long, selectedPoint.lat],
    speed: 0.8,
  });
});
</script>

<template>
  <div class="h-full min-h-80 w-ful">
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
          <div
            class="tooltip tooltip-top hover:cursor-pointer"
            :class="{
              'tooltip-open': mapStore.selectedPoint?.id === point.id,
            }"
            :data-tip="point.name"
            @mouseenter="selectPointWithoutFlyTo(point)"
            @mouseleave="mapStore.selectedPoint = null"
          >
            <Icon
              name="tabler:map-pin-filled"
              size="30"
              :class="mapStore.selectedPoint?.id === point.id ? 'text-accent' : 'text-secondary' "
            />
          </div>
        </template>
        <mgl-popup>
          <h3 class="text-xl">
            {{ point.name }}
          </h3>
          <p>
            {{ point.description }}
          </p>
        </mgl-popup>
      </MglMarker>
    </MglMap>
  </div>
</template>
