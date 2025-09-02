<script setup lang="ts">
import { useMediaStore } from '@/stores/mediaStore'
import { computed } from "vue";

const props = defineProps({
  vb: {
    type: String,
    default: "0 0 24 24"
  },
  h: {
    type: String,
    default: "24"
  },
  w: {
    type: String,
    default: "24"
  },
  hMobile: {
    type: String,
    default: null
  },
  wMobile: {
    type: String,
    default: null
  }
})


const media = useMediaStore()

const h = computed(() => {
  return media.isMobile ? (props.hMobile || (parseInt(props.h) - 4)) : props.h
})
const w = computed(() => {
  return media.isMobile ? (props.wMobile || (parseInt(props.w) - 4)) : props.w
})

</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" :viewBox="vb" :height="h" :width="w" fill="currentColor" v-bind="$attrs">
    <slot/>
  </svg>
</template>

<style scoped>

</style>