const VoiceDetectionData = {
    recorder: null,
    isRecordingReady: true,
};

function audioRecorder(stream) {
    VoiceDetectionData.recorder = new ExtendableMediaRecorder(stream, {
        mimeType: 'audio/wav',
    });
    VoiceDetectionData.recorder.addEventListener('dataavailable', onRecordingReady);
}

function onRecordingReady(e) {
    if (VoiceDetectionData.isRecordingReady) {
        suspendRecording();

        // Playback or send to server
        // const audio = $("#audio");
        // audio.src = URL.createObjectURL(e.data);
        // audio.play();
        // audio.onended = () => {
        //     resumeRecording();
        // };

        try {
            const formData = new FormData();
            formData.append('file', e.data, "recording.wav");

            fetch(`${STT_BACKEND_URL}/stt`, {
                method: 'POST',
                body: formData,
            })
                .then(res => res.json())
                .then(data => {
                    if (data?.error) {
                        alert(`API Error: ${data.error}`);
                    } else {
                        alert(`Transcription: ${data.text}`);
                    }
                })
                .catch(err => alert(`Failed: ${err}`));
        } finally {
            resumeRecording();
        }
    }
}

function startRecording() {
    VoiceDetectionData.recorder.start();
}

function stopRecording() {
    VoiceDetectionData.recorder.stop();
    VoiceDetectionData.isRecordingReady = true;
}

function restartRecording() {
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/state
    if (VoiceDetectionData.recorder.state !== 'inactive') {
        VoiceDetectionData.recorder.stop();
    }

    VoiceDetectionData.isRecordingReady = false;
    VoiceDetectionData.recorder.start();
}

function abortRecording() {
    VoiceDetectionData.recorder.stop();
    VoiceDetectionData.isRecordingReady = false;
}

function suspendRecording() {
    DEFAULT_PARAMETERS_CONFIGURATION.recordingEnabled = false;
}

function resumeRecording() {
    DEFAULT_PARAMETERS_CONFIGURATION.recordingEnabled = true;
}
