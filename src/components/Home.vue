<script setup>
import {ref} from 'vue';
import { useRouter } from 'vue-router';
import { useAudioStore } from "@/stores/audioStore.ts";
import FileIcon from "@/components/icons/FileIcon.vue";
import {convertToWav} from "@/composables/useFFmpeg.js";

const router = useRouter();
const invalidFile = ref(false);
const dragOver = ref(false);

const audioStore = useAudioStore();

function checkValidity(type) {
  return type.startsWith("audio/");
}

/**
 * @param file {File}
 */
function handleFile(file) {
  if (!checkValidity(file.type)) {
    invalidFile.value = true;
    dragOver.value = false;
    return;
  } else {
    invalidFile.value = false;
  }
  
  const reader = new FileReader();
  reader.onload = async (e) => {
    const byteArray = new Uint8Array(e.target.result);
    const textContent = new TextDecoder().decode(byteArray);
    const converted = await convertToWav(
        byteArray, file.name
    );

    audioStore.setFile(
        file,
        byteArray,
        converted,
        textContent
    );
    console.info(`The file '${file.name}' as been loaded successfully.`);
    await router.push('/view');
  };
  reader.readAsArrayBuffer(file);
}

const handleFileChange = (event) => {
  const file = event.target.files[0];
  handleFile(file);
};

const handleDragOver = (event) => {
  event.preventDefault();
  
  if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
    const fileType = event.dataTransfer.items[0].type;
    
    if (!checkValidity(fileType)) {
      invalidFile.value = true;
      dragOver.value = false;
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

  handleFile(file);
};

</script>

<template>
<div class="container">
  <label class="content" for="audio_file" 
         :class="{ dragover: dragOver, invalid: invalidFile }" 
         @dragover="handleDragOver" @dragleave="handleDragLeave" @drop="handleDrop">
    <FileIcon :color="invalidFile ? 'var(--error-text)' : 'var(--secondary-text)'" />
    <h2>Click or drop your audio file here</h2>
    <p>We support any audio file supported by ffmpeg</p>
  </label>
  <input type="file" name="audio_file" id="audio_file" accept="audio/*" @change="handleFileChange" />
</div>
</template>

<style scoped>
div.container {
  height: 260px;
  font-family: Jaro, sans-serif;
  
  & > input[type="file"] {
    display: none;
  }

  & > label.content {
    justify-content: flex-end;
    cursor: pointer;

    & > h2 {
      margin-top: 30px;
      font-size: 20px;
      line-height: 16px;
    }
    & > p {
      font-size: 12px;
      width: fit-content!important;
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