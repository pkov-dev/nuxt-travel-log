<script setup lang="ts">
const props = defineProps<{
  label: string;
  icon: string;
  href: string;
  showLabel: boolean;
}>();

const route = useRoute();
</script>

<template>
  <div
    :data-tip="showLabel ? undefined : props.label"
    class="tooltip-right"
    :class="{
      tooltip: !showLabel,
    }"
  >
    <NuxtLink
      :to="props.href"
      :class="{
        'bg-base-200': route.path === props.href,
      }"
      class="relative flex flex-nowrap items-center gap-2 p-2 hover:cursor-pointer hover:bg-base-300"
    >
      <span class=" flex items-center justify-center">
        <Icon :name="props.icon" size="24" />
      </span>

      <Transition name="label">
        <span
          v-if="showLabel"
          class="whitespace-nowrap"
        >
          {{ props.label }}
        </span>
      </Transition>
    </NuxtLink>
  </div>
</template>

<style scoped>
.label-enter-active,
.label-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.2s ease;
}

.label-enter-from,
.label-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

.label-enter-to,
.label-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
