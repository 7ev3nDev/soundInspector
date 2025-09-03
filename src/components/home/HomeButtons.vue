<script setup lang="ts">
import InfoIcon from "@/components/icons/InfoIcon.vue";
import { useHeaderStore } from "@/stores/headerStore";
import { ref } from "vue";

const headerStore = useHeaderStore();

const shouldBounce = ref(!localStorage.getItem('startedTour'));

function startTourAndSetBounce() {
  headerStore.emit('startTour');
  localStorage.setItem('startedTour', 'true');
  shouldBounce.value = false;
}

</script>

<template>
  <a @click="startTourAndSetBounce" class="btn mini" :class="{ bounce: shouldBounce }" title="Start Tour">
    Tour
  </a>

  <RouterLink to="/info" class="btn">
    <InfoIcon/>
  </RouterLink>
</template>

<style scoped>
.btn.mini.bounce {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  20% {
    transform: translateY(+5px);
  }
  0%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}
</style>