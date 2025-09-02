<script setup lang="ts">
import MoreIcon from "@/components/icons/MoreIcon.vue";
import { useAudioStore } from "@/stores/audioStore.ts";
import { useHeaderStore } from "@/stores/headerStore.js";
import { useMediaStore } from "@/stores/mediaStore";

const audioStore = useAudioStore();
const headerStore = useHeaderStore();
const mediaStore = useMediaStore();
</script>

<template>
<span class="btn no-action" v-if="mediaStore.isDesktop">
  {{ audioStore.file?.name }}
</span>

  <span class="btn mini" @click="headerStore.toggleMenu()">
  <MoreIcon/>
</span>
</template>

<style scoped>

</style>