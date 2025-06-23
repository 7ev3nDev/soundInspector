import { defineStore } from 'pinia'
import { ref } from 'vue'
import {getWavDuration} from "../composables/audioUtils";

export const useAudioStore = defineStore('audio', () => {
    const file = ref<File | null>(null)
    const name = ref('')
    const convertedWavBytes = ref<Uint8Array | null>(null)
    const byteArray = ref<Uint8Array | null>(null)
    const duration = ref(0)
    const decodedText = ref('')

    function setFile(
        newFile: File,
        bytes: Uint8Array,
        wavBytes: Uint8Array,
        text = ''
    ) {
        file.value = newFile
        name.value = newFile.name
        byteArray.value = bytes
        convertedWavBytes.value = wavBytes
        decodedText.value = text
        duration.value = getWavDuration(wavBytes)
    }

    function clear() {
        file.value = null
        name.value = ''
        byteArray.value = null
        convertedWavBytes.value = null
        decodedText.value = ''
        duration.value = 0
    }

    return {
        file,
        name,
        convertedWavBytes,
        byteArray,
        duration,
        decodedText,
        setFile,
        clear
    }
})
