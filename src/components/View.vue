<script setup>
import { useAudioStore } from "@/stores/audioStore.ts";
import {useRouter} from "vue-router";
import {onMounted, onUnmounted} from "vue";

const audioStore = useAudioStore();
const router = useRouter();

if (!audioStore.name) {
  router.push("/");
}

console.log(audioStore.$state);

onMounted(() => {
    document.querySelector("div#app").classList.add("active");
})

onUnmounted(() => {
    document.querySelector("div#app").classList.remove("active");
})

</script>

<template>

</template>

<style scoped>

</style>