<script setup>
import BaseIcon from "@/components/icons/BaseIcon.vue";

defineProps({
  width: {
    type: String,
    default: "14"
  },
  height: {
    type: String,
    default: "15"
  }
});

</script>

<template>
  <BaseIcon :w="width" :h="height" viewBox="0 0 13 15" fill="none" w-mobile="3">
    <path d="M2.33325 15C3.61658 15 4.66658 14.0357 4.66658 12.8571V2.14286C4.66658 0.964286 3.61658 0 2.33325 0C1.04992 0 -8.2016e-05 0.964286 -8.2016e-05 2.14286V12.8571C-8.2016e-05 14.0357 1.04992 15 2.33325 15ZM9.33325 2.14286V12.8571C9.33325 14.0357 10.3833 15 11.6666 15C12.9499 15 13.9999 14.0357 13.9999 12.8571V2.14286C13.9999 0.964286 12.9499 0 11.6666 0C10.3833 0 9.33325 0.964286 9.33325 2.14286Z" fill="white"/>
  </BaseIcon>
</template>

<style scoped>

</style>