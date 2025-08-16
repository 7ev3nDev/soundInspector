<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useAudioStore } from "@/stores/audioStore.ts";
import { decodeMorseFromBinary } from "@/composables/audioUtils.js";
  
const audioStore = useAudioStore();
const binaryCanvas = ref(null);

const morseCode = ref("");
const seeAnyway = ref(false);

onMounted(async () => {
  if (audioStore.convertedWavBytes) {
    const audioContext = new AudioContext();

    const wavBuffer = audioStore.convertedWavBytes.buffer.slice(
        audioStore.convertedWavBytes.byteOffset,
        audioStore.convertedWavBytes.byteOffset + audioStore.convertedWavBytes.byteLength
    );

    const audioBuffer = await audioContext.decodeAudioData(wavBuffer);
    const samples = audioBuffer.getChannelData(0);

    const envelope = samples.map(Math.abs);
    const threshold = 0.3;
    const binary = envelope.map(v => (v > threshold ? 1 : 0));
    
    drawBinary(binary);
    
    morseCode.value = await decodeMorseFromBinary(binary);
  }
});

onUnmounted(() => {
  if (binaryCanvas.value) {
    const canvas = binaryCanvas.value;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
});

function drawBinary(binary) {
  if (!binaryCanvas.value) return;
  const canvas = binaryCanvas.value;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const step = Math.ceil(binary.length / canvas.width);
  for (let i = 0; i < canvas.width; i++) {
    const val = binary[i * step] || 0;
    ctx.fillStyle = val ? "black" : "transparent";
    ctx.fillRect(i, 0, 1, canvas.height);
  }
}


</script>

<template>
  <template v-if="!morseCode.includes('?')">
    <canvas ref="binaryCanvas" height="50"></canvas>
    {{ morseCode || "Nothing found" }}
  </template>
  <template v-else>
    {{ seeAnyway ? morseCode : "No Morse code detected." }}
    
    <a class="btn" @click="seeAnyway = !seeAnyway">
      {{ seeAnyway ? "Hide" : "See anyway" }}
    </a>
  </template>
  
</template>

<style scoped>
a.btn {
  margin-top: 4px;
  height: 32px;
  min-height: 32px;
  font-size: 14px;
}
</style>