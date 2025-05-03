function onSTTAndSERReady({ stt, ser }) {
    if (stt?.error || ser?.error) {
        alert(`API Error:\nSTT: ${stt?.error || "(None)"}\nSER: ${ser?.error || "(None)"}`);
    } else {
        alert(`Transcription: ${stt.text}\n\nEmotion: ${ser.emotion}`);
    }
}
