<script setup>
import BaseIcon from "@/components/icons/BaseIcon.vue";

defineProps({
  width: {
    type: String,
    default: "13"
  },
  height: {
    type: String,
    default: "15"
  }
});

</script>

<template>
  <BaseIcon :w="width" :h="height" viewBox="0 0 13 15" fill="none" w-mobile="3">
    <path
        d="M0.902344 1.24996V13.6768C0.902344 14.6245 1.93561 15.2002 2.73134 14.6844L12.3989 8.47099C13.1352 8.00318 13.1352 6.92362 12.3989 6.44382L2.73134 0.242373C1.93561 -0.273415 0.902344 0.302348 0.902344 1.24996Z"
        fill="white"/>
  </BaseIcon>
</template>

<style scoped>

</style>