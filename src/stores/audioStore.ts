import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getWavDuration } from "../composables/audioUtils";

const eqBands = [ 32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000 ];
const equalizerGains = ref<number[]>(eqBands.map(() => 0));

export const useAudioStore = defineStore('audio', () => {
    const file = ref<File | null>(null)
    const name = ref('')
    const convertedWavBytes = ref<Uint8Array | null>(null)
    const byteArray = ref<Uint8Array | null>(null)
    const duration = ref(0)
    const decodedText = ref('')

    const fileToReprocess = ref<File | null>(null);

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

    function updateEqualizerGain(index: number, value: number) {
        if (index < 0 || index >= equalizerGains.value.length) {
            console.warn(`Invalid EQ band index: ${index}`);
            return;
        }
        equalizerGains.value[index] = value;
    }

    function setFileToReprocess(file: File) {
        clear();
        fileToReprocess.value = file;
    }

    return {
        file,
        name,
        convertedWavBytes,
        byteArray,
        duration,
        decodedText,
        fileToReprocess,
        eqBands,
        equalizerGains,
        setFile,
        clear,
        updateEqualizerGain,
        setFileToReprocess
    }
})
