<script setup lang="ts">
const props = defineProps<{
  label: string;
  name: string;
  value: number;
  error?: string;
  disabled?: boolean;
}>();

const { handleBlur, value: inputValue, handleChange } = useField<number>(props.name, {
  initialValue: props.value,
});

function dateChange(event: Event) {
  const target = event.target as HTMLInputElement;
  handleChange(new Date(target.value).getTime());
}
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ label }}
    </legend>
    <input
      :value="formatDate(inputValue)"
      :name
      :disabled
      type="date"
      :class="{
        'input-error': error,
      }"
      class="input w-full"
      @change="dateChange"
      @blur="handleBlur"
    >
    <p v-if="error" class="label text-error">
      {{ error }}
    </p>
  </fieldset>
</template>
