var audioContext = null;

window.onload = async function () {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    $("#microphone-button").addEventListener('click', async function () {
        // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/suspend#examples
        if (audioContext === null) {
            audioContext = new AudioContext();
            try {
                await askUserForAudioInput();
            } catch (e) {
                alert(`Stream generation failed with exception: ${e}`);
                UI.backgroundWhenDialing();
            }
            UI.displayPleaseWait();
            audioContext.resume().finally(() => {
                UI.hidePleaseWait();
            });
        } else if (audioContext.state === 'suspended') {
            UI.displayPleaseWait();
            audioContext.resume().finally(() => {
                UI.hidePleaseWait();
                UI.backgroundWhenInCall();
                UI.micUnmuted();
            });
        } else if (audioContext.state === 'running') {
            audioContext.suspend();
            UI.backgroundWhenDialing();
            UI.micMuted();
        }
    });
};

async function askUserForAudioInput() {
    // TODO: Display instructions
    await navigator.mediaDevices.getUserMedia({
        'audio': {
            'mandatory': {
                'googEchoCancellation': 'false',
                'googAutoGainControl': 'false',
                'googNoiseSuppression': 'false',
                'googHighpassFilter': 'false'
            },
            'optional': []
        },
    })
        .then(audioStream);
}
