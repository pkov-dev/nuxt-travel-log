<script setup lang="ts">
import type { InsertLocation } from "~~/lib/db/schema";

const { $csrfFetch } = useNuxtApp();

async function onSubmit(values: InsertLocation) {
  await $csrfFetch("/api/locations", {
    method: "POST",
    body: values,
  });
}

function onSubmitComplete() {
  navigateTo("/dashboard");
}
</script>

<template>
  <div class="container max-w-md mx-auto px-4">
    <div class="my-4">
      <h1 class="text-lg">
        Add Location
      </h1>
      <p class="text-sm">
        A location is a place you have traveled or will travel to. I ca be a city, country, state or point of interest. You can add specific times you visited this location after adding it.
      </p>
    </div>
    <LocationForm
      :on-submit
      :on-submit-complete
      submit-label="Add"
      submit-icon="tabler:circle-plus-filled"
    />
  </div>
</template>
