<script setup>
import { onMounted, ref, shallowRef } from 'vue';
import { useRouter } from 'vue-router';
import { useAudioStore } from "@/stores/audioStore.ts";
import FileIcon from "@/components/icons/FileIcon.vue";
import { convertToWav } from "@/composables/useFFmpeg.ts";
import { useMediaStore } from "@/stores/mediaStore.ts";
import { checkValidity, escapeHTML } from "@/composables/generalUtils.ts";
import { useTourStore } from "@/stores/tourStore.ts";
import { useHeaderStore } from "@/stores/headerStore.ts";
import HomeButtons from "@/components/home/HomeButtons.vue";

const router = useRouter();
const audioStore = useAudioStore();
const mediaStore = useMediaStore();
const tourStore = useTourStore();
const headerStore = useHeaderStore();

const invalidFile = ref(false);
const dragOver = ref(false);
const loading = ref(false);

/**
 * @param file {File}
 */
function handleFile(file) {
  if ( !checkValidity(file.type) ) {
    invalidFile.value = true;
    dragOver.value = false;
    return;
  } else {
    invalidFile.value = false;
  }

  loading.value = true;

  const reader = new FileReader();
  reader.onload = async (e) => {
    const byteArray = new Uint8Array(e.target.result);
    const textContent = new TextDecoder("latin1").decode(byteArray);
    const converted = await convertToWav(
        new Uint8Array(byteArray), file.name
    );

    const regex = new RegExp(`[ -~]{${4},}`, "g");

    audioStore.setFile(
        file,
        byteArray,
        converted,
        escapeHTML(textContent.match(regex).join("\n")).replaceAll("\n", "<br>") || ""
    );
    console.info(`The file '${file.name}' as been loaded successfully.`);
    await router.push('/view');
  };
  reader.readAsArrayBuffer(file);
}

const handleDragOver = (event) => {
  event.preventDefault();

  if ( event.dataTransfer.items && event.dataTransfer.items.length > 0 ) {
    const fileType = event.dataTransfer.items[0].type;

    if ( !checkValidity(fileType) ) {
      invalidFile.value = true;
      dragOver.value = false;
      loading.value = false;
      return;
    } else {
      invalidFile.value = false;
    }
  }
  dragOver.value = true;
};

const handleDragLeave = () => {
  dragOver.value = false;
  invalidFile.value = false;
}

const handleDrop = (event) => {
  event.preventDefault();

  const file = event.dataTransfer.files[0];

  loading.value = true;

  handleFile(file);
};

const homeButtons = shallowRef(HomeButtons);

function startTour() {
  tourStore.startTour([
    {
      popover: {
        title: 'Welcome to soundInspector!',
        description: 'This tour will guide you through the main features of the application.'
      },
    },
    {
      element: 'main > .container',
      popover: {
        title: 'SoundInspector',
        description: 'This is where you can drag and drop your audio files to analyze them.<br><b>Try dropping a file here!</b><br><br>Or click <b>Test File</b> to load a sample audio file.',
        position: 'top',
        onPopoverRender: (popover) => {
          const testButton = document.createElement('button');
          testButton.innerText = 'Test File';
          popover.footerButtons.appendChild(testButton);

          testButton.addEventListener('click', async () => {
            loading.value = true;
            const response = await fetch('/sample.wav');
            const blob = await response.blob();
            const file = new File([ blob ], "sample.wav", { type: "audio/wav" });
            handleFile(file);
            tourStore.pauseTour()
          })
        },
        showButtons: [ "previous" ]
      },
    }
  ])
}

onMounted(() => {
  headerStore.setButtonsContent({
    component: homeButtons,
    props: {}
  })
  headerStore.setEmits({
    "startTour": startTour
  })

  const fileToReprocess = audioStore.fileToReprocess;
  if ( fileToReprocess ) {
    handleFile(fileToReprocess);
    audioStore.setFileToReprocess(null);
  }

  // if ( tourStore.started ) {
  //   startTour()
  // }
})

</script>

<template>
  <div class="container">
    <div class="loading content" v-if="loading">
      <h2>Loading...</h2>
      <p>Please wait while we process your audio file.</p>
      <p>This may take a while depending on the file size.</p>
    </div>
    <label class="content" for="audio_file" v-else
           :class="{ dragover: dragOver, invalid: invalidFile }"
           @dragover="handleDragOver" @dragleave="handleDragLeave" @drop="handleDrop">
      <FileIcon :color="invalidFile ? 'var(--error-text)' : 'var(--secondary-text)'" v-if="!loading"/>
      <h2>Click
        <template v-if="mediaStore.isDesktop">
          or drop
        </template>
        <template v-else>
          to select
        </template>
        your audio file here
      </h2>
      <p>We support any audio file supported by ffmpeg</p>
    </label>
    <input type="file" name="audio_file" id="audio_file" accept="audio/*"
           @change="event => handleFile(event.target.files[0])" :disabled="loading"/>
  </div>
</template>

<style scoped>
div.container {
  height: 260px;
  font-family: Jaro, sans-serif;

  & > input[type="file"] {
    display: none;
  }

  & > .loading.content {
    align-items: center;
    justify-content: center;

    & > h2 {
      font-size: 3rem;
    }

    & > p {
      width: fit-content;
    }
  }

  & > label.content {
    justify-content: flex-end;
    cursor: pointer;

    & > h2 {
      margin-top: 30px;
      font-size: 20px;
      line-height: 16px;
      text-align: center;
    }

    & > p {
      font-size: 12px;
      width: fit-content !important;
    }

    &:hover, &.dragover {
      background: var(--secondary-hover);
    }

    &.invalid {
      background: var(--error);
      color: var(--error-text);
    }
  }
}

</style>