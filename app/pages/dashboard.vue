<script setup lang="ts">
import { CURRENT_LOCATION_PAGES, LOCATION_PAGES } from "~~/lib/constants";

const isSidebarOpen = ref(true);
const route = useRoute();
const locationsStore = useLocationsStore();
const sidebarStore = useSidebarStore();
const mapStore = useMapStore();

const { data: currentLocation, status: currentLocationStatus } = useCurrentLocation();

const sidebarTopItems = computed(() => {
  if (LOCATION_PAGES.has(String(route.name))) {
    return [
      {
        id: "link-dashboard",
        label: "Locations",
        href: "/dashboard",
        icon: "tabler:map",
      },
      {
        id: "link-location-add",
        label: "Add Location",
        href: "/dashboard/add",
        icon: "tabler:circle-plus-filled",
      },
    ];
  }

  else if (CURRENT_LOCATION_PAGES.has(String(route.name))) {
    return [
      {
        id: "link-dashboard",
        label: "Back to Locations",
        href: "/dashboard",
        icon: "tabler:arrow-left",
      },
      ...(
        currentLocation.value && currentLocationStatus.value !== "pending"
          ? [{
              id: "link-current-edit",
              label: "Edit Location",
              to: {
                name: "dashboard-location-slug-edit",
                params: {
                  slug: route.params.slug,
                },
              },
              icon: "tabler:map-pin-cog",
            }, {
              id: "link-current-location",
              label: currentLocation.value?.name,
              to: {
                name: "dashboard-location-slug",
                params: {
                  slug: route.params.slug,
                },
              },
              icon: "tabler:map",
            }, {
              id: "link-location-add",
              label: "Add Location Log",
              to: {
                name: "dashboard-location-slug-add",
                params: {
                  slug: route.params.slug,
                },
              },
              icon: "tabler:circle-plus-filled",
            }]
          : []
      ),
    ];
  }

  return [];
});

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
  localStorage.setItem("isSidebarOpen", isSidebarOpen.value.toString());
}

onMounted(() => {
  isSidebarOpen.value = localStorage.getItem("isSidebarOpen") === "true";
  if (route.path !== "/dashboard") {
    locationsStore.refresh();
  }
});
</script>

<template>
  <div class="flex-1 flex">
    <div
      class="bg-base-100 transition-all duration-300 shrink-0"
      :class="{
        'w-64': isSidebarOpen,
        'w-16': !isSidebarOpen,
      }"
    >
      <div
        class="flex hover:cursor-pointer hover:bg-base-200 p-2"
        :class="{
          'justify-center': !isSidebarOpen,
          'justify-end': isSidebarOpen,
        }"
        @click="toggleSidebar"
      >
        <Icon
          v-if="isSidebarOpen"
          name="tabler:chevron-left"
          size="32"
        />
        <Icon
          v-else
          name="tabler:chevron-right"
          size="32"
        />
      </div>
      <div class="flex flex-col">
        <div v-if="route.path.startsWith('/dashboard/location') && currentLocationStatus === 'pending'" class="flex items-center justify-center">
          <div class="loading" />
        </div>
        <SidebarButton
          v-for="item in sidebarTopItems"
          :key="item.id"
          :show-label="isSidebarOpen"
          :label="item.label"
          :icon="item.icon"
          :href="item.href"
          :to="item.to"
        />
        <div v-if="sidebarStore.loading || sidebarStore.sidebarItems.length" class="divider" />

        <div v-if="sidebarStore.loading" class="px-4">
          <div class="skeleton h-4 w-full" />
        </div>
        <template v-if="!sidebarStore.loading && sidebarStore.sidebarItems.length">
          <SidebarButton
            v-for="item in sidebarStore.sidebarItems"
            :key="item.id"
            :show-label="isSidebarOpen"
            :label="item.label"
            :icon="item.icon"
            :to="item.to"
            :icon-color="isPointSelected(item.mapPoint, mapStore.selectedPoint) ? 'text-accent' : undefined"
            @mouseenter="mapStore.selectedPoint = item.mapPoint ?? null"
            @mouseleave="mapStore.selectedPoint = null"
          />
        </template>
        <div class="divider" />
        <SidebarButton
          :show-label="isSidebarOpen"
          label="Sign Out"
          icon="tabler:logout-2"
          href="/sign-out"
        />
      </div>
    </div>
    <div class="flex-1 overflow-auto bg-base-200">
      <div
        class="flex flex-col size-full gap-x-4"
      >
        <!-- <div class="flex size-full" :class="{ 'flex-col': !EDIT_PAGES.has(String(route.name)) }"> -->
        <NuxtPage />
        <AppMap class="flex-1" />
      </div>
    </div>
  </div>
</template>
