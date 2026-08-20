<script setup lang="ts">
import type { FetchError } from "ofetch";

import { CENTER_UK } from "~~/lib/constants";
import { InsertLocation } from "~~/lib/db/schema";

const { $csrfFetch } = useNuxtApp();
const router = useRouter();
const mapStore = useMapStore();
const loading = ref(false);
const submitted = ref(false);
const submitError = ref("");

const { errors, handleSubmit, meta, setErrors, setFieldValue } = useForm({
  validationSchema: toTypedSchema(InsertLocation),
  initialValues: {
    name: "",
    description: "",
    long: (CENTER_UK as [number, number])[0],
    lat: (CENTER_UK as [number, number])[1],
  },
});

const onSubmit = handleSubmit(async (values) => {
  try {
    submitError.value = "";
    loading.value = true;
    await $csrfFetch("/api/locations", {
      method: "POST",
      body: values,
    });
    submitted.value = true;
    navigateTo("/dashboard");
  }
  catch (e) {
    const error = e as FetchError;
    if (error.data?.data) {
      setErrors(error.data?.data);
    }
    submitError.value = getFetchErrorMessage(error);
  }
  loading.value = false;
});

function formatNumber(value?: number) {
  if (!value)
    return 0;

  return value.toFixed(5);
}

function searchResultSelected(result: NominatimResult) {
  setFieldValue("name", result.display_name);
  mapStore.addedPoint = {
    id: 1,
    name: "Added Point",
    description: "",
    long: Number(result.lon),
    lat: Number(result.lat),
    centerMap: true,
  };
}

watch(
  () => [mapStore.addedPoint?.long, mapStore.addedPoint?.lat],
  ([long, lat]) => {
    setFieldValue("long", long);
    setFieldValue("lat", lat);
  },
);

onMounted(() => {
  mapStore.addedPoint = {
    id: 1,
    name: "Added Point",
    description: "",
    long: (CENTER_UK as [number, number])[0],
    lat: (CENTER_UK as [number, number])[1],
  };
});

onBeforeRouteLeave(() => {
  if (meta.value.dirty && !submitted.value) {
    // eslint-disable-next-line no-alert
    const confirm = window.confirm("Are you sure you want to leave? All unsaved changes will be lost");

    if (!confirm) {
      return false;
    }
  }
  mapStore.addedPoint = null;
  return true;
});
</script>

<template>
  <div class="container max-w-md mx-auto">
    <div class="my-4">
      <h1 class="text-lg">
        Add Location
      </h1>
      <p class="text-sm">
        A location is a place you have traveled or will travel to. I ca be a city, country, state or point of interest. You can add specific times you visited this location after adding it.
      </p>
    </div>
    <div
      v-if="submitError"
      role="alert"
      class="alert alert-warning"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <span>{{ submitError }}</span>
    </div>
    <form class=" flex flex-col gap-2" @submit.prevent="onSubmit">
      <AppFormField
        name="name"
        label="Name"
        :error="errors.name"
        :disabled="loading"
      />
      <AppFormField
        name="description"
        label="Description"
        type="textarea"
        :disabled="loading"
        :error="errors.description"
      />
      <p class="text-xs text-gray-400">
        Current coordinates: {{ formatNumber(mapStore.addedPoint?.lat) }}, {{ formatNumber(mapStore.addedPoint?.long) }}
      </p>
      <p>
        To set the coordinates:
      </p>
      <ul class="list-disc ml-4 text-sm">
        <li>
          Drag the <Icon name="tabler:map-pin-filled" class="text-warning" /> marker on the map.
        </li>
        <li>
          Double click the map.
        </li>
        <li>
          Search for a location below.
        </li>
      </ul>
      <div class="flex justify-end gap-2">
        <button
          :disabled="loading"
          type="button"
          class="btn btn-outline"
          @click="router.back"
        >
          <Icon name="tabler:arrow-left" size="24" />
          Cancel
        </button>
        <button :disabled="loading" class="btn btn-primary">
          Add
          <span v-if="loading" class="loading loading-spinner loading-sm" />
          <Icon
            v-else
            name="tabler:circle-plus-filled"
            size="24"
          />
        </button>
      </div>
    </form>
    <div class="divider" />
    <AppPlaceSearch @result-selected="searchResultSelected" />
  </div>
</template>
