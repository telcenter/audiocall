const calculateDecibel = (signal) => - Math.round(20 * Math.log10(1 / signal));

const VoiceDetectionListenersData = {
    userVolumeMagnitudeFadeoutTimer: setTimeout(() => { }, 0),
};

document.addEventListener('signal', event => {
    clearTimeout(VoiceDetectionListenersData.userVolumeMagnitudeFadeoutTimer);

    const dB = calculateDecibel(event.detail.volume);
    UI.userVolumeMagnitude(dB);
    VoiceDetectionListenersData.userVolumeMagnitudeFadeoutTimer
        = setTimeout(() => {
            UI.userVolumeMagnitude(0);
        }, 500);
});

document.addEventListener('silence', event => {
    clearTimeout(VoiceDetectionListenersData.userVolumeMagnitudeFadeoutTimer);
    UI.userVolumeMagnitude(0);
});

document.addEventListener('mute', event => {
    clearTimeout(VoiceDetectionListenersData.userVolumeMagnitudeFadeoutTimer);
    UI.userVolumeMagnitude(0);
});

document.addEventListener('prespeechstart', event => {
    restartRecording();
});

document.addEventListener('speechstart', event => {
    // startRecording();
});

document.addEventListener('speechstop', event => {
    stopRecording();
});

document.addEventListener('speechabort', event => {
    abortRecording();
});

// document.addEventListener('mutedmic', event => {
//     UI.micMuted();
// });

document.addEventListener('unmutedmic', event => {
    UI.backgroundWhenInCall();
    UI.micUnmuted();
});
