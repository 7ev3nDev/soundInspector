<script setup lang="ts">
import {useHeaderStore} from "@/stores/headerStore";
import {useRouter} from "vue-router";
import {useAudioStore} from "@/stores/audioStore.ts";
import {useMediaStore} from "@/stores/mediaStore";

const router = useRouter();
const header = useHeaderStore();
const mediaStore = useMediaStore();
const audioStore = useAudioStore();
</script>

<template>
  <a class="btn no-action" v-if="mediaStore.isMobile">
    {{ audioStore.file.name }}
  </a>
  <a @click="header.emit('openEqualizer')">Equalizer</a>
  <a @click="header.emit('download')">Download .WAV</a>
  <a class="danger" @click="router.push('/')">Close</a>
</template>

<style scoped>
a.danger {
  background-color: var(--error);
  
  &:hover {
    background-color: var(--error-hover)!important;
  }
}
</style>