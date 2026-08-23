<script lang="ts" setup>
import { SearchSchema } from "~~/lib/zod-schemas";
import { FetchError } from "ofetch";

const emit = defineEmits<{
  resultSelected: [Result: NominatimResult];
}>();

const searchResults = ref<NominatimResult[]>([]);
const form = useTemplateRef("form");
const loading = ref(false);
const hasSearched = ref(false);
const errorMessage = ref("");

async function onSubmit(query: Record<string, string>) {
  loading.value = true;
  hasSearched.value = true;
  errorMessage.value = "";
  searchResults.value = [];

  try {
    const results = await $fetch<NominatimResult[]>("/api/search", {
      query,
    });
    searchResults.value = results;
  }
  catch (error) {
    if (error instanceof FetchError) {
      errorMessage.value = getFetchErrorMessage(error);
      return;
    }
    throw error;
  }
  finally {
    loading.value = false;
  }
}

function setLocation(result: NominatimResult) {
  emit("resultSelected", result);
  searchResults.value = [];
  errorMessage.value = "";
  hasSearched.value = false;

  if (form.value) {
    form.value.resetForm();
  }
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <Form
      ref="form"
      v-slot="{ errors }"
      class="flex flex-col gap-2 items-center"
      :validation-schema="toTypedSchema(SearchSchema)"
      :initial-values="{ q: '' }"
      @submit="onSubmit"
    >
      <div class="join mt-4">
        <div>
          <label class="input join-item">
            <Icon name="tabler:search" />
            <Field
              type="text"
              name="q"
              placeholder="Search for a location..."
              :disabled="loading"
              :class="{
                'input-error': errors.q,
              }"
            />
          </label>
          <div
            v-if="errors.q"
            class="text-error text-shadow-olive-400 text-sm px-1"
            :class="{
              'validator': errors.q,
              'validator-hint': !errors.q,
            }"
          >
            {{ errors.q }}
          </div>
        </div>
        <button
          :disabled="loading"
          class="btn btn-neutral join-item"
        >
          Search
        </button>
      </div>
    </Form>
    <div
      v-if="!loading && errorMessage"
      role="alert"
      class="alert alert-error"
    >
      {{ errorMessage }}
    </div>
    <div
      v-if="!loading && hasSearched && !searchResults.length"
      role="alert"
      class="alert alert-warning"
    >
      No results found.
    </div>
    <div v-if="loading" class="flex justify-center">
      <div class="loading loading-lg" />
    </div>
    <div class="flex flex-col overflow-auto gap-2 max-h-60 mt-2">
      <div
        v-for="result in searchResults"
        :key="result.place_id"
        class="card card-sm bg-base-100"
      >
        <div class="card-body">
          <h4 class="card-title">
            {{ result.display_name }}
          </h4>
          <div class="justify-end card-actions">
            <button
              class="btn btn-warning btn-sm"
              @click="setLocation(result)"
            >
              Set Location
              <Icon name="tabler:map-pin-share" size="20" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
