const socket = io();
console.log(socket);
socket.onopen = () => {
    socket.send("Here's some text that the server is urgently awaiting!");
};

socket.onmessage = (e) => {
    console.log('Message from server:', e.data);
};

socket.on('server-event', (data) => {
    console.log(data);
});

socket.on('row', (data) => {
    console.log(data);
});
