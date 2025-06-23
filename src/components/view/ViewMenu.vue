<script setup lang="ts">
import {useHeaderStore} from "@/stores/headerStore";
import {useRouter} from "vue-router";

const router = useRouter();
const header = useHeaderStore();
</script>

<template>
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