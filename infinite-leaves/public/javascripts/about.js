const socket = io();

socket.on('updateStanzas', (data) => {
    console.log(data);
});
