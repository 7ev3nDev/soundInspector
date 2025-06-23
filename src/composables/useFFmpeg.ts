// This file has been done by aistudio.google.com -
// input from the template at https://github.com/ffmpegwasm/vue-app/blob/main/src/App.vue

import {FFmpeg} from '@ffmpeg/ffmpeg';
import type {LogEvent, ProgressEvent} from '@ffmpeg/ffmpeg/dist/esm/types';
import {toBlobURL} from '@ffmpeg/util';
import {readonly, ref, type Ref} from 'vue';

const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core-mt@0.12.9/dist/esm';

const ffmpeg = new FFmpeg();

const isReady = ref(false);
const isRunning = ref(false);
const progress = ref(0);
const logs: Ref<string[]> = ref([]);

ffmpeg.on('log', ({ message }: LogEvent) => {
    logs.value.push(message);
});

ffmpeg.on('progress', ({ progress: p }: ProgressEvent) => {
    progress.value = p;
});

/**
 * A comprehensive Vue composable for interacting with FFmpeg.wasm.
 * It provides a singleton FFmpeg instance and manages its loading, execution,
 * and state.
 */
export function useFFmpeg() {
    /**
     * Loads the FFmpeg core. This must be called before any other FFmpeg
     * operations can be performed. It is safe to call this multiple times.
     */
    const load = async (): Promise<void> => {
        if (isReady.value) return;

        logs.value.push('Loading FFmpeg core...');
        try {
            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
                workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
            });
            isReady.value = true;
            logs.value.push('FFmpeg core loaded successfully.');
        } catch (error) {
            logs.value.push('Failed to load FFmpeg core. Check console for details.');
            console.error(error);
            isReady.value = false;
        }
    };

    /**
     * Executes an FFmpeg command.
     * @param args An array of command-line arguments for FFmpeg.
     * @returns A promise that resolves when the command completes.
     */
    const exec = async (args: string[]): Promise<void> => {
        if (!isReady.value) throw new Error('FFmpeg is not loaded. Call load() first.');
        if (isRunning.value) throw new Error('An FFmpeg command is already running.');

        isRunning.value = true;
        progress.value = 0;
        logs.value = []; // Clear previous logs

        try {
            await ffmpeg.exec(args);
        } catch (error) {
            console.error('FFmpeg execution failed:', error);
            throw error; // Re-throw to be caught by the caller
        } finally {
            isRunning.value = false;
        }
    };

    /**
     * Writes a file to FFmpeg's virtual file system.
     * This is necessary to provide input files for FFmpeg commands.
     * @param path The path/filename in the virtual file system.
     * @param data The file content as a Uint8Array.
     */
    const writeFile = async (path: string, data: Uint8Array): Promise<void> => {
        if (!isReady.value) throw new Error('FFmpeg is not loaded. Call load() first.');
        await ffmpeg.writeFile(path, data);
    };

    /**
     * Reads a file from FFmpeg's virtual file system.
     * This is used to get the output file after a command has run.
     * @param path The path/filename in the virtual file system.
     * @returns A promise that resolves with the file content as a Uint8Array.
     */
    const readFile = async (path: string): Promise<Uint8Array> => {
        if (!isReady.value) throw new Error('FFmpeg is not loaded. Call load() first.');
        const data = await ffmpeg.readFile(path);
        return data as Uint8Array;
    };

    /**
     * Terminates the currently running FFmpeg command.
     */
    const terminate = async (): Promise<void> => {
        if (isRunning.value) {
            await ffmpeg.terminate();
            isRunning.value = false;
        }
    };

    return {
        isReady: readonly(isReady),
        isRunning: readonly(isRunning),
        progress: readonly(progress),
        logs: readonly(logs),
        load,
        exec,
        writeFile,
        readFile,
        terminate,
        /** The raw FFmpeg instance for advanced use cases. */
        ffmpegInstance: ffmpeg,
    };
}

/**
 * Converts any audio file data into the WAV format.
 * This function is self-contained: it will automatically load the FFmpeg
 * core if it hasn't been loaded yet.
 *
 * @param audioData The raw audio file content as a Uint8Array.
 * @param inputFilename The original filename (e.g., "my-song.mp3").
 *                      The extension is crucial for FFmpeg to identify the format.
 * @returns A promise that resolves with the raw WAV file content as a Uint8Array.
 *          The promise will be rejected if conversion fails.
 */
export async function convertToWav(
    audioData: Uint8Array,
    inputFilename: string
): Promise<Uint8Array> {
    const { isReady, load, exec, writeFile, readFile } = useFFmpeg();

    if (!isReady.value) {
        await load();
    }

    const outputFilename = 'output.wav';

    await writeFile(inputFilename, audioData);

    await exec(['-i', inputFilename, outputFilename]);

    return await readFile(outputFilename);
}