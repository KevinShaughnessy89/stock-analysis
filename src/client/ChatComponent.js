import { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";

const ChatComponent = () => {
	const [socket, setSocket] = useState(null);
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);
	const [isTyping, setIsTyping] = useState(false);
	const [typingTimeout, setTypingTimeout] = useState(null);

	useEffect(() => {
		const newSocket = io(process.env.CLIENT_URL);

		newSocket.on("connect", () => {
			console.log("Connected to server");
		});

		newSocket.on("message", (message) => {
			setMessages((prev) => [...prev, message]);
		});

		newSocket.on("typing", (data) => {
			setIsTyping(data.isTyping);
		});

		setSocket(newSocket);

		return () => {
			newSocket.close();
		};
	}, []);

	const sendMessage = useCallback((e) => {
		e.preventDefault();
		if (message.trim() && socket) {
			socket.emit("message", {
				text: message,
				timestamp: new Date().toISOString,
			});
			setMessage("");
		}
	});

	const handleTyping = useCallback((e) => {
		setMessage(e.target.value);

		if (socket) {
			socket.emit("typing", {
				isTyping: true,
			});
		}

		if (typingTimeout) clearTimeout(typingTimeout);

		const timeout = setTimeout(() => {
			socket.emit("typing", {
				isTyping: false,
			});
		}, 2000);

		setTypingTimeout(timeout);
	});

	return (
		<div>
			<div>
				{messages.map((message, index) => (
					<div key={index}>
						<span>{message.text}</span>
					</div>
				))}
				{isTyping && <span>Someone is typing...</span>}
			</div>

			<form onSubmit={sendMessage}>
				<input
					type="text"
					value={message}
					onChange={handleTyping}
					placeholder="Type a message..."
					className="text-black"
				/>
				<button type="submit">Send</button>
			</form>
		</div>
	);
};

export default ChatComponent;
