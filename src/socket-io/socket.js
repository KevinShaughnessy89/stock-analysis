const chatHandlers = (io, socket) => {
	const handleMessage = (data) => {
		console.log("Message received: ", data);
		io.emit("message", data);
	};

	const handleTyping = (data) => {
		socket.broadcast.emit("userTyping", data);
	};

	socket.on("message", handleMessage);
	socket.on("typing", handleTyping);
};

export function registerSocketHandlers(io) {
	io.on("connection", (socket) => {
		console.log("User connected: ", socket.id);

		chatHandlers(io, socket);
	});
}
