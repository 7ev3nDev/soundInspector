<script setup>
import BaseIcon from "@/components/icons/BaseIcon.vue";

defineProps({
  width: {
    type: String,
    default: "6"
  },
  height: {
    type: String,
    default: "22"
  }
});

</script>

<template>
  <BaseIcon :w="width" :h="height" viewBox="0 0 6 22" fill="none" w-mobile="3">
    <path d="M3 5.5C4.65 5.5 6 4.2625 6 2.75C6 1.2375 4.65 0 3 0C1.35 0 0 1.2375 0 2.75C0 4.2625 1.35 5.5 3 5.5ZM3 8.25C1.35 8.25 0 9.4875 0 11C0 12.5125 1.35 13.75 3 13.75C4.65 13.75 6 12.5125 6 11C6 9.4875 4.65 8.25 3 8.25ZM3 16.5C1.35 16.5 0 17.7375 0 19.25C0 20.7625 1.35 22 3 22C4.65 22 6 20.7625 6 19.25C6 17.7375 4.65 16.5 3 16.5Z" fill="white"/>
  </BaseIcon>
</template>

<style scoped>

</style>