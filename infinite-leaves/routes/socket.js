const socketIO = require('socket.io');

module.exports = function (server) {
    const io = socketIO(server);

    io.on('connection', (socket) => {
        console.log('A client connected!');

        // Emit an event to the client
        socket.emit('server-event', { message: 'Hello from the server!' });

        setInterval(() => {
            socket.emit('row', { message: 'Hello from the server!' });
        }, 5000);
    });
};
