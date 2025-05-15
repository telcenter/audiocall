// $("greeting-audio").play();

const params = new URLSearchParams(window.location.search);
const VoiceDetectionData = {
    recorder: null,
    isRecordingReady: true,
    chatId: parseInt(params.get('chatId')),
    accountId: parseInt(params.get('accountId')),
    phoneNumber: "" + (params.get('phoneNumber') || ""),
};

if (!VoiceDetectionData.chatId || !VoiceDetectionData.accountId || !VoiceDetectionData.phoneNumber) {
    alert("Wrong params");
    throw new Error("Wrong params");
}

function audioRecorder(stream) {
    VoiceDetectionData.recorder = new ExtendableMediaRecorder(stream, {
        mimeType: 'audio/wav',
    });
    VoiceDetectionData.recorder.addEventListener('dataavailable', onRecordingReady);
}

async function onRecordingReady(e) {
    if (VoiceDetectionData.isRecordingReady) {
        suspendRecording();

        try {
            const formData = new FormData();
            formData.append('file', e.data, "recording.wav");

            //////////////////////////////////////////////////////
            //////////////////// STT + SER ///////////////////////
            //////////////////////////////////////////////////////

            const { stt, ser } = await fetch(`${STT_BACKEND_URL}/stt-and-ser`, {
                method: 'POST',
                body: formData,
            })
                .then(res => res.json());

            if (stt?.error || ser?.error) {
                // alert(`API Error:\nSTT: ${stt?.error || "(None)"}\nSER: ${ser?.error || "(None)"}`);
                // $("repeat-audio").play();
                return;
            }
            console.log(`Transcription: ${stt.text}\n\nEmotion: ${ser.emotion}`);

            //////////////////////////////////////////////////////
            ///////////////////// TER + RAG //////////////////////
            //////////////////////////////////////////////////////

            const replyMessage = await new Promise((resolve, reject) => {
                let replyMessage = "";

                sendMessage(
                    {
                        chat_id: VoiceDetectionData.chatId,
                        ser_emotion: ser.emotion,
                        text_content: stt.text,
                    },

                    chunk => {
                        if (chunk.error) {
                            alert('Có lỗi xảy ra khi gửi tin nhắn.');
                            reject(chunk);
                        }
                        replyMessage += chunk.data;
                        if (chunk.is_finished) {
                            resolve(replyMessage);
                        }
                    },
                );
            });

            //////////////////////////////////////////////////////
            //////////////////////// STT /////////////////////////
            //////////////////////////////////////////////////////

            const replyAudioRes = await fetch(`${STT_BACKEND_URL}/tts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: replyMessage,
                }),
            });

            if (!replyAudioRes.ok) throw new Error("Failed to fetch audio");
            const blob = await replyAudioRes.blob(); // Get MP3 as Blob

            const audio = $("#audio");
            audio.src = URL.createObjectURL(blob); // e.data → blob here
            audio.play();
            audio.onended = () => {
                URL.revokeObjectURL(audio.src); // cleanup
                resumeRecording();              // your callback
            };
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
