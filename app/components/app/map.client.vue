<script setup lang="ts">
import { CENTER_UK } from "~~/lib/constants";

const mapStore = useMapStore();

const colorMode = useColorMode();
const style = computed(() => colorMode.value === "dark" ? "/styles/dark.json" : "https://tiles.openfreemap.org/styles/liberty");

const zoom = 4;
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
      <MglMarker v-for="point in mapStore.mapPoints" :key="point.id" :coordinates="[point.long, point.lat]" />
    </MglMap>
  </div>
</template>
