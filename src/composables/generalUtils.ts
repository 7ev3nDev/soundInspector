export function escapeHTML(str: string): string {
    return str.replace(/[&<>"']/g, match => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    })[match]);
}

export function downloadWav(uint8array, filename = 'output.wav') {
    const blob = new Blob([ uint8array ], { type: 'audio/wav' });

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

export function checkValidity(type) {
    return type.startsWith("audio/");
}
