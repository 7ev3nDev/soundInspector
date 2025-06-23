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