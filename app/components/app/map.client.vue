<script setup lang="ts">
import type { MglEvent } from "@indoorequal/vue-maplibre-gl";
import type { LngLat } from "maplibre-gl";

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

function updateAddedPoint(location: LngLat) {
  if (mapStore.addedPoint) {
    mapStore.addedPoint.lat = location.lat;
    mapStore.addedPoint.long = location.lng;
  }
}

function onDoubleClick(mglEvent: MglEvent<"dblclick">) {
  if (mapStore.addedPoint) {
    mapStore.addedPoint.lat = mglEvent.event.lngLat.lat;
    mapStore.addedPoint.long = mglEvent.event.lngLat.lng;
  }
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

watch(() => mapStore.addedPoint, (newValue, oldValue) => {
  if ((newValue && !oldValue) || newValue?.centerMap) {
    mapRef.map?.flyTo({
      center: [newValue.long, newValue.lat],
      speed: 0.8,
      zoom: 6,
    });
  }
}, {
  immediate: true,
});
</script>

<template>
  <div class="h-full min-h-80 w-ful">
    <MglMap
      :map-style="style"
      :center="CENTER_UK"
      :zoom="zoom"
      @map:dblclick="onDoubleClick"
    >
      <MglNavigationControl />
      <MglMarker
        v-if="mapStore.addedPoint"
        draggable
        class-name="z-50"
        :coordinates="[mapStore.addedPoint.long, mapStore.addedPoint.lat]"
        @update:coordinates="updateAddedPoint"
      >
        <template #marker>
          <div
            class="tooltip tooltip-top tooltip-open hover:cursor-pointer"
            data-tip="Drag to your desired location"
          >
            <Icon
              name="tabler:map-pin-filled"
              size="35"
              class="text-warning"
            />
          </div>
        </template>
      </MglMarker>
      <MglMarker
        v-for="point in mapStore.mapPoints"
        :key="point.id"
        :coordinates="[point.long, point.lat]"
      >
        <template #marker>
          <div
            class="tooltip tooltip-top hover:cursor-pointer"
            :class="{
              'tooltip-open': isPointSelected(point, mapStore.selectedPoint),
            }"
            :data-tip="point.name"
            @mouseenter="mapStore.selectedPoint = point"
            @mouseleave="mapStore.selectedPoint = null"
          >
            <Icon
              name="tabler:map-pin-filled"
              size="30"
              :class="isPointSelected(point, mapStore.selectedPoint) ? 'text-accent' : 'text-secondary' "
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
          <div class="flex justify-end mt-4">
            <NuxtLink
              v-if="point.to"
              :to="point.to"
              class="btn btn-sm btn-outline"
            >
              {{ point.toLabel }}
            </NuxtLink>
          </div>
        </mgl-popup>
      </MglMarker>
    </MglMap>
  </div>
</template>
