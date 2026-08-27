<script lang="ts" setup>
import type { FetchError } from "ofetch";

import { CENTER_UK } from "~~/lib/constants";
import { InsertLocation } from "~~/lib/db/schema";

const props = defineProps<{
  initialValues?: InsertLocation | null;
  onSubmit: (location: InsertLocation) => Promise<any>;
  onSubmitComplete: () => void;
  submitLabel: string;
  submitIcon: string;
}>();

const router = useRouter();
const mapStore = useMapStore();

const { errors, handleSubmit, meta, setErrors, setFieldValue } = useForm({
  validationSchema: toTypedSchema(InsertLocation),
  initialValues: {
    name: props.initialValues?.name || "",
    description: props.initialValues?.description || "",
    long: props.initialValues?.long || (CENTER_UK as [number, number])[0],
    lat: props.initialValues?.lat || (CENTER_UK as [number, number])[1],
  },
});

const submitted = ref(false);
const loading = ref(false);
const submitError = ref("");

const onSubmit = handleSubmit(async (values: InsertLocation) => {
  try {
    submitError.value = "";
    loading.value = true;

    await props.onSubmit(values);

    submitted.value = true;
    props.onSubmitComplete();
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

function formatNumber(value?: number) {
  if (!value)
    return 0;

  return value.toFixed(5);
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
    long: props.initialValues?.long || (CENTER_UK as [number, number])[0],
    lat: props.initialValues?.lat || (CENTER_UK as [number, number])[1],
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
        {{ submitLabel }}
        <span v-if="loading" class="loading loading-spinner loading-sm" />
        <Icon
          v-else
          :name="submitIcon"
          size="24"
        />
      </button>
    </div>
  </form>
  <div class="divider" />
  <AppPlaceSearch @result-selected="searchResultSelected" />
</template>
