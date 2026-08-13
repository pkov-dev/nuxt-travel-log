<script setup lang="ts">
defineProps<{
  label: string;
  name: string;
  error?: string;
  type?: "text" | "textarea";
  disabled?: boolean;
}>();
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ label }}
    </legend>
    <Field
      :as="type || 'input'"
      :name
      :disabled
      :type="type || 'text'"
      :class="{
        'input-error': error,
        'input': !type || type === 'text',
        'textarea': type === 'textarea',
      }"
      class="input w-full"
    />
    <p v-if="error" class="label text-error">
      {{ error }}
    </p>
  </fieldset>
</template>
