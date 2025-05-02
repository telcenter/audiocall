const $ = document.querySelector.bind(document);

const UI = {
    backgroundWhenDialing: () => {
        const backgroundWhenDialing = document.querySelector('#background-when-dialing');
        const backgroundWhenInCall = document.querySelector('#background-when-in-call');
        backgroundWhenDialing.style.visibility = 'visible';
        backgroundWhenInCall.style.visibility = 'hidden';
    },

    backgroundWhenInCall: () => {
        const backgroundWhenDialing = document.querySelector('#background-when-dialing');
        const backgroundWhenInCall = document.querySelector('#background-when-in-call');
        backgroundWhenDialing.style.visibility = 'hidden';
        backgroundWhenInCall.style.visibility = 'visible';
    },

    userVolumeMagnitude: (magnitude) => {
        const px = 75 + magnitude * 5;
        document.getElementById("background-when-in-call").style.background = `radial-gradient(1012.8px at 50% calc(${px}px + 100vh), rgb(6, 135, 241) 0%, rgba(23, 114, 180, 0.267) 30%, rgb(24, 24, 27) 100%)`;
    },

    micMuted: () => {
        const microphoneEnabled = document.querySelector('#microphone-enabled');
        const microphoneDisabled = document.querySelector('#microphone-disabled');
        const microphoneText = document.querySelector('#microphone-text');
        microphoneEnabled.style.display = 'none';
        microphoneDisabled.style.display = 'inherit';
        microphoneText.textContent = 'Unmute';
    },

    micUnmuted: () => {
        const microphoneEnabled = document.querySelector('#microphone-enabled');
        const microphoneDisabled = document.querySelector('#microphone-disabled');
        const microphoneText = document.querySelector('#microphone-text');
        microphoneEnabled.style.display = 'inherit';
        microphoneDisabled.style.display = 'none';
        microphoneText.textContent = 'Mute';
    },

    displayPleaseWait: () => {
        $("#please-wait").style.visibility = "visible";
    },

    hidePleaseWait: () => {
        $("#please-wait").style.visibility = "hidden";
    },
};

UI.micMuted();
