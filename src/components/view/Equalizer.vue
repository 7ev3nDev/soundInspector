<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
import CloseIcon from "@/components/icons/CloseIcon.vue";
import PlayIcon from "@/components/icons/PlayIcon.vue";
import PauseIcon from "@/components/icons/PauseIcon.vue";
import {useAudioStore} from "@/stores/audioStore";

const audioStore = useAudioStore();
const eqBands = audioStore.eqBands;

const props = defineProps<{
  close: () => void,
  audioContext: AudioContext,
  sourceNode: AudioBufferSourceNode,

  play: () => void,
  pause: () => void,
  isPlaying: boolean,
}>();

const isRendering = ref(false);

let filters: BiquadFilterNode[] = [];
onMounted(() => {
  document.body.style.overflow = 'hidden';

  if (!props.audioContext || !props.sourceNode) {
    console.error("AudioContext or SourceNode is missing!");
    return;
  }

  filters = eqBands.map((band, i) => {
    const filter = props.audioContext.createBiquadFilter();
    filter.type = band <= 32 ? 'lowshelf' : band >= 16000 ? 'highshelf' : 'peaking';
    filter.frequency.value = band;
    filter.Q.value = 1;
    filter.gain.value = audioStore.equalizerGains[i];
    return filter;
  });

  props.sourceNode.disconnect();

  const firstFilter = filters[0];
  const lastFilter = filters[filters.length - 1];

  props.sourceNode.connect(firstFilter);

  for (let i = 0; i < filters.length - 1; i++) {
    filters[i].connect(filters[i + 1]);
  }

  lastFilter.connect(props.audioContext.destination);
});

onUnmounted(() => {
  document.body.style.overflow = '';
});

function updateGain(index: number, value: string) {
  const gainValue = parseFloat(value);

  audioStore.updateEqualizerGain(index, gainValue);

  if (filters[index]) {
    filters[index].gain.value = gainValue;
  }
}

function togglePlayPause() {
  if (props.isPlaying) {
    props.pause();
  } else {
    props.play();
  }
}

function formatFrequency(freq: number): string {
  return freq >= 1000 ? `${freq / 1000}k` : `${freq}`;
}
</script>

<template>
  <div class="overlay" @click.self="close">
    <div class="equalizer" @click.stop>
      <span class="close" @click.stop="close">
        <CloseIcon/>
      </span>
      <div class="content">
        <div class="sliders">
          <div class="slider-container" v-for="(band, index) in eqBands" :key="band">
            <input
                type="range"
                orient="vertical"
                :min="-40"
                :max="40"
                :step="0.1"
                :value="audioStore.equalizerGains[index]"
                @input="updateGain(index, ($event.target as HTMLInputElement).value)"
            />
            <label>{{ formatFrequency(band) }}</label>
          </div>
        </div>

        <div class="controls">
          <div class="left">
            <a class="btn mini" @click.stop="togglePlayPause">
              <PlayIcon v-if="!isPlaying"/>
              <PauseIcon v-else/>
            </a>
            <a class="btn" @click.stop="() => {
              eqBands.forEach((_, i) => updateGain(i, '0'));
            }">
              Reset
            </a>
          </div>
          <div class="right">
            <!--               @click.stop="/* TODO */"-->
            <a class="btn mini" id="execute"
               :class="{ 'disabled': isRendering }">
              {{ isRendering ? 'Rendering...' : 'Load It!' }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sliders {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 16px;
  padding-bottom: 24px;
}

.btn.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: var(--secondary-hover);
}

.slider-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  gap: 8px;
  font-family: monospace;
  font-size: 14px;
  color: var(--secondary-text);
}

input[type="range"][orient="vertical"] {
  writing-mode: bt-lr;
  -webkit-appearance: slider-vertical;

  appearance: none;
  background: transparent;

  width: 28px;
  height: 100%;
  max-height: 250px;
  cursor: grab;
  padding: 0;
}

input[type="range"][orient="vertical"]:active {
  cursor: grabbing;
}

input[type="range"][orient="vertical"]::-webkit-slider-runnable-track {
  width: 10px;
  height: 100%;
  background: var(--primary);
  border-radius: 4px;
  border: 1px solid var(--primary-text);
}

input[type="range"][orient="vertical"]::-moz-range-track {
  width: 10px;
  height: 100%;
  background: var(--primary);
  border-radius: 4px;
  border: 1px solid var(--primary-text);
}


input[type="range"][orient="vertical"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;

  width: 26px;
  height: 12px;

  background: var(--secondary-text);
  border-radius: 2px;
  border: 1px solid var(--primary);

  margin-top: -1px;
}

input[type="range"][orient="vertical"]::-moz-range-thumb {
  width: 26px;
  height: 12px;
  background: var(--secondary-text);
  border-radius: 2px;
  border: none;
}


.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);

  backdrop-filter: blur(1px);

  z-index: 100;

  & > .equalizer {
    max-width: 96%;
    max-height: 96%;

    width: 800px;
    height: 500px;

    display: flex;
    justify-content: center;
    align-items: center;

    background: var(--primary);
    color: var(--primary-text);

    border-radius: 32px;

    padding: 18px 32px;

    position: relative;

    & > .close {
      position: absolute;
      top: 8px;
      right: 16px;

      width: 36px;
      height: 36px;

      display: flex;
      justify-content: center;
      align-items: center;

      cursor: pointer;

      background: var(--secondary-text);
      color: var(--secondary);

      border-radius: 50%;

      &:hover {
        background: var(--secondary-hover);
      }
    }

    & > .content {
      width: 100%;
      height: 100%;

      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;

      font-size: 2rem;
      font-family: Jaro, sans-serif;

      background: var(--secondary);
      color: var(--secondary-text);

      border-radius: 24px;

      padding: 16px 32px;

      & > .controls {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        width: 100%;
        height: 50px;

        gap: 8px;

        & > .left, & > .right {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;

          font-size: 20px;

          & > #execute {
            padding-inline: 32px;
            background: var(--error);

            &:hover {
              background: var(--error-hover);
            }
          }
        }
      }
    }
  }

  & .btn {
    padding-inline: 13.5px
  }
}
</style>