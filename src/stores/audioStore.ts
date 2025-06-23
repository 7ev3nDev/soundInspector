import { defineStore } from 'pinia'
import { ref } from 'vue'
import {getWavDuration} from "../composables/audioUtils";

export const useAudioStore = defineStore('audio', () => {
    const file = ref<File | null>(null)
    const name = ref('')
    const convertedWavBlob = ref<Uint8Array | null>(null)
    const byteArray = ref<Uint8Array | null>(null)
    const duration = ref(0)
    const decodedText = ref('')

    function setFile(
        newFile: File,
        bytes: Uint8Array,
        wavBlob: Uint8Array,
        text = ''
    ) {
        file.value = newFile
        name.value = newFile.name
        byteArray.value = bytes
        convertedWavBlob.value = wavBlob
        decodedText.value = text
        duration.value = getWavDuration(wavBlob)
    }

    function clear() {
        file.value = null
        name.value = ''
        byteArray.value = null
        convertedWavBlob.value = null
        decodedText.value = ''
        duration.value = 0
    }

    return {
        file,
        name,
        convertedWavBlob,
        byteArray,
        duration,
        decodedText,
        setFile,
        clear
    }
})
