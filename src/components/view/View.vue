<script setup>
import {useAudioStore} from "@/stores/audioStore.ts";
import {useRouter} from "vue-router";
import {onMounted, onUnmounted, shallowRef, watch} from "vue";
import {useHeaderStore} from "@/stores/headerStore.js";
import ViewMenu from "@/components/view/ViewMenu.vue";
import {ref} from 'vue'
import { parseBuffer } from 'music-metadata';

const audioStore = useAudioStore();
const headerStore = useHeaderStore();
const router = useRouter();

// import WaveSurfer from "wavesurfer.js";
// import SpectrogramPlugin from "wavesurfer.js/plugins/spectrogram";
// import HoverPlugin from "wavesurfer.js/plugins/hover";

/**
 * @type {import('wavesurfer.js').default}
 */
import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js'
/**
 * @type {import('wavesurfer.js/dist/plugins/spectrogram.js').default}
 */
import SpectrogramPlugin from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/spectrogram.esm.js'
import HoverPlugin from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/hover.esm.js'


import MorseDecoder from "@/components/view/MorseDecoder.vue";
import ViewButtons from "@/components/view/ViewButtons.vue";

const waveformRef = ref(null)
/**
 * @type {import('wavesurfer.js').default}
 */
let wavesurfer = null

if (!audioStore.file) {
  router.push("/");
}

function downloadWav(uint8array, filename = 'output.wav') {
  const blob = new Blob([uint8array], {type: 'audio/wav'});

  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;

  const lastDotIndex = filename.lastIndexOf(".");
  a.download = filename.substring(0, lastDotIndex) + '.wav';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

const viewMenu = shallowRef(ViewMenu);
const viewButtons = shallowRef(ViewButtons);

/**
 * @type {import('music-metadata').IAudioMetadata|null}
 */
const metadata = ref(null);

const showOtherMetadata = ref(false);

onMounted(async () => {
  document.querySelector("div#app").classList.add("active");
  headerStore.setMenuContent({
    component: viewMenu,
    props: {}
  })
  headerStore.setButtonsContent({
    component: viewButtons,
    props: {}
  })
  headerStore.setEmits({
    download: () => {
      downloadWav(audioStore.convertedWavBytes, audioStore.name);
    }
  })

  if (audioStore.convertedWavBytes) {
    const blob = new Blob([audioStore.convertedWavBytes], {type: 'audio/wav'})
    const url = URL.createObjectURL(blob)

    wavesurfer = WaveSurfer.create({
      container: waveformRef.value,
      waveColor: '#8ecae6',
      progressColor: '#219ebc',
      height: 128,
      scrollParent: true,
      autoCenter: true,
      dragToSeek: true,
      fillParent: true,
      mediaControls: true,
      autoScroll: true,
      minPxPerSec: 100,
      partialRender: true,
      plugins: [
        SpectrogramPlugin.create({
          labels: true,
          height: 200,
          scale: 'linear'
        }),
        SpectrogramPlugin.create({
          labels: true,
          height: 200,
          scale: 'logarithmic'
        }),
        HoverPlugin.create({
          lineColor: '#ff0000',
          lineWidth: 2,
          labelBackground: '#555',
          labelColor: '#fff',
          labelSize: '11px',
        })
      ]
    })

    wavesurfer.load(url)

    wavesurfer.once('decode', () => {
      const slider = document.querySelector('input[type="range"]')

      slider
          .addEventListener('input', (e) => {
            const minPxPerSec = e.target.valueAsNumber
            wavesurfer.zoom(minPxPerSec)
          })
    })

    metadata.value = await parseBuffer(audioStore.byteArray);
    console.log(metadata.value)
  }
});

onUnmounted(() => {
  document.querySelector("div#app").classList.remove("active");
  headerStore.clear()
  audioStore.clear()
  if (wavesurfer) wavesurfer.destroy()
})

function printMeta(el) {
  if (Array.isArray(el)) {
    return el.map((item) => {
      if (typeof item === 'object') {
        return JSON.stringify(item, null, 2);
      }
      return item;
    }).join(', ') || 'Empty Array';
  } else if (typeof el === 'object') {
    return JSON.stringify(el, null, 2);
  } else {
    return el;
  } 
}

</script>

<template>
  <div class="list" v-if="metadata?.format">
    <div class="container meta" v-for="(value, key) in metadata.format" :key="key">
      <span>{{ key }}</span>
      <div class="content">
        {{ printMeta(value) }}
      </div>
    </div>
    
    <div class="container meta" v-for="(value, key) in metadata.common" :key="key" v-if="showOtherMetadata">
      <span>{{ key }}</span>
      <div class="content">
        {{ printMeta(value) }}
      </div>
    </div>
    
    <div class="container meta" v-for="(value, key) in metadata.native" :key="key" v-if="showOtherMetadata">
      <span>{{ key }}</span>
      <div class="content">
        {{ printMeta(value) }}
      </div>
    </div>
  </div>
  
  <div class="container meta" id="meta-toggle">
    <a class="btn" @click.prevent="showOtherMetadata = !showOtherMetadata">
      {{ showOtherMetadata ? 'See Less Metadata' : 'Show More Metadata' }}
    </a>
  </div>
  
  <div class="container">
    <span>Audio Viewer - Wave + Spectogram</span>
    <div class="content waveform">
      <div ref="waveformRef"></div>
      <div class="options">
        Zoom: <input max="500" min="10" type="range" value="100"/>
      </div>
    </div>
  </div>

  <div class="container">
    <span>Strings</span>
    <div class="content">
      <p v-html="audioStore.decodedText"></p>
    </div>
  </div>

  <div class="container credits">
    <span>Morse Code</span>
    <div class="content ">
      <MorseDecoder/>
    </div>
  </div>


  <div class="container credits">
    <div class="content">
      Made with <3 by Paolones - Using wavesurfer.js
    </div>
  </div>
</template>

<style>

.waveform, .spectrogram {
  width: 100%;

  & > div {
    width: 100%;
  }
}
</style>

<style scoped>
div.list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  
  max-width: 960px;
  
  gap: 16px;
  padding: 16px;
  
  row-gap: 10px;
  
  & > div.container {
    margin-bottom: 0;
  }
}

div#meta-toggle {
  background: #6a0fd6;
  
  & > a.btn {
    background: var(--secondary);
    color: var(--secondary-text);
  }
}

div.container {
  display: flex;
  flex-direction: column;
  max-width: 960px;

  margin-bottom: 16px;
  
  &.meta {
    max-width: fit-content;
    padding-inline: 16px;
    border-radius: 24px;

    & > .content {
      text-align: center;
    }
  }

  &.credits {
    max-width: fit-content;

    & > .content {
      text-align: center;
    }
  }

  & > span {
    width: 100%;
    text-align: center;
  }

  & > .content {
    overflow-x: auto;
    overflow-y: auto;
    max-width: 100%;
    flex: 1;

    &.waveform {
      padding-inline: 4px;
      max-height: unset !important;

      & > .options {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 4px;

        font-size: .9rem;

        padding: 6px 8px;
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
        background: #454448;
        color: #fff;

        & > button {
          background: #5a5a5b;
          color: #fff;

          display: flex;
          align-items: center;
          justify-content: center;

          border: none;
          aspect-ratio: 1/1;
          margin-right: 4px;
          cursor: pointer;

          font-size: 1.2em;

          min-width: 25px;

          border-radius: 6px;
        }
      }
    }
  }
}

div#app {
  gap: 30px;
}

@media screen and (max-width: 600px) {
  div.container {
    & > .content {
      padding-inline: 10px;
    }
  }
}

</style>