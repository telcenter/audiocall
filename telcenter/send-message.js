function sendMessage(payload, callback) {
    const socket = io(`${MAIN_BACKEND_URL}`);

    socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        callback({ is_finished: true, error: true, data: 'Connection error: ' + error });
        socket.disconnect();
    });

    socket.on('connect', () => {
        socket.emit('message', payload);
    });

    socket.on('message', (output) => {
        callback(output);

        if (output.is_finished) {
            socket.disconnect();
        }
    });

    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });
}
