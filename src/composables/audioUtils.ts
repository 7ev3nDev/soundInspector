/**
 * Calculates the duration of a WAV audio file from its byte array.
 * @param {Uint8Array} wavByteArray The byte array of the WAV file.
 * @returns {number | null} The duration in seconds, or null if it's not a valid WAV file.
 */
export function getWavDuration(wavByteArray: Uint8Array): number | null {
    if (wavByteArray.length < 44) return null;

    const view = new DataView(wavByteArray.buffer);
    
    if (view.getUint32(0, false) !== 0x52494646 || view.getUint32(8, false) !== 0x57415645) {
        console.error("Not a valid RIFF/WAVE file.");
        return null;
    }

    const byteRate = view.getUint32(28, true);
    if (byteRate === 0) return null;
    
    let pos = 12;
    while (pos < view.byteLength - 8) {
        const chunkId = view.getUint32(pos, false);
        const chunkSize = view.getUint32(pos + 4, true);
        
        if (chunkId === 0x64617461) {
            return chunkSize / byteRate;
        }
        
        pos += 8 + chunkSize;
        if (chunkSize % 2 !== 0) {
            pos += 1;
        }
    }
    
    console.error("Could not find the 'data' chunk in the WAV file.");
    return null;
}

const MORSE_DICT = {
    '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E',
    '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J',
    '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O',
    '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T',
    '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y',
    '--..': 'Z', '-----': '0', '.----': '1', '..---': '2',
    '...--': '3', '....-': '4', '.....': '5', '-....': '6',
    '--...': '7', '---..': '8', '----.': '9'
};

/**
 * Decodes a Morse code message from a WAV audio file.
 * Made with help from AI. 
 * @param wavBytes
 */
export async function decodeMorseFromWav(wavBytes: Uint8Array): Promise<string> {
    const audioContext = new AudioContext();

    const wavBuffer = wavBytes.buffer.slice(
        wavBytes.byteOffset,
        wavBytes.byteOffset + wavBytes.byteLength
    );

    const audioBuffer = await audioContext.decodeAudioData(wavBuffer);
    const samples = audioBuffer.getChannelData(0);

    const envelope = samples.map(Math.abs);
    const threshold = 0.3;
    const binary = envelope.map(v => (v > threshold ? 1 : 0));

    return await decodeMorseFromBinary(binary);
}

export async function decodeMorseFromBinary(binary: Float32Array): Promise<string> {
    const runs: { value: number; duration: number }[] = [];
    let current = binary[0];
    let count = 1;
    let value = !!current;

    for (let i = 1; i < binary.length; i++) {
        if (binary[i] === current) {
            count++;
        } else {
            runs.push({ value: +value, duration: count });
            value = !!binary[i];
            current = binary[i];
            count = 1;
        }
    }
    runs.push({ value: current, duration: count });

    const filteredRuns = runs.filter(r => !(r.value === 0 && r.duration < 100));

    const mergedRuns = filteredRuns.reduce((acc, r) => {
        const last = acc[acc.length - 1];
        if (last && last.value === r.value) {
            last.duration += r.duration;
        } else {
            acc.push({ ...r });
        }
        return acc;
    }, [] as typeof runs);

    const silenceDurations = mergedRuns
        .filter(r => r.value === 0 && r.duration > 100)
        .map(r => r.duration);

    const timeUnit = mode(silenceDurations);

    const morseString = mergedRuns.map(r => {
        const units = Math.round(r.duration / timeUnit);
        if (r.value === 1) {
            return units <= 1 ? '.' : '-';
        } else {
            if (units <= 1) return '';
            if (units <= 3) return ' ';
            return '   ';
        }
    }).join('');

    return morseString
        .split('   ')
        .map(word =>
            word.trim().split(' ').map(code => MORSE_DICT[code] || '?').join('')
        )
        .join(' ');
}

function mode(arr: number[]): number {
    const counts: Record<number, number> = {};
    for (const v of arr) {
        counts[v] = (counts[v] || 0) + 1;
    }
    return +Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

export function formatFrequency(freq: number): string {
    return freq >= 1000 ? `${freq / 1000}k` : `${freq}`;
}

/**
 * Encodes an AudioBuffer into a WAV file format (Uint8Array).
 * @param {AudioBuffer} buffer The audio buffer to encode.
 * @returns {Uint8Array} A Uint8Array representing the WAV file.
 * 
 * Modified https://gist.github.com/Daninet/22edc59cf2aee0b9a90c18e553e49297 with help from Gemini 2.5
 */
export function audioBufferToWav(buffer) {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const view = new DataView(new ArrayBuffer(length));
    const channels = [];
    let i;
    let sample;
    let offset = 0;
    let pos = 0;
    
    const setUint16 = (data) => {
        view.setUint16(pos, data, true);
        pos += 2;
    };
    const setUint32 = (data) => {
        view.setUint32(pos, data, true);
        pos += 4;
    };
    
    setUint32(0x46464952);
    setUint32(length - 8);
    setUint32(0x45564157);
    
    setUint32(0x20746d66);
    setUint32(16);
    setUint16(1);
    setUint16(numOfChan);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2);
    setUint16(16);
    
    setUint32(0x61746164);
    setUint32(length - pos - 4);
    
    for (i = 0; i < buffer.numberOfChannels; i++) {
        channels.push(buffer.getChannelData(i));
    }

    while (pos < length) {
        for (i = 0; i < numOfChan; i++) {
            sample = Math.max(-1, Math.min(1, channels[i][offset]));
            sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
            view.setInt16(pos, sample, true);
            pos += 2;
        }
        offset++;
    }

    return new Uint8Array(view.buffer);
}
