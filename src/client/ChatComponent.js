import { useEffect, useState, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import { makeApiCall } from "@/common/makeApiCall.js";
import { apiEndpoints } from "./apiEndpoints.js";
import { useAuthStore } from "./authStore.js";

const ChatComponent = () => {
	const { username } = useAuthStore();

	console.log(`username: ${username}`);

	const messageRef = useRef(null);

	const [socket, setSocket] = useState(null);
	const [message, setMessage] = useState({
		username: username,
		message: null,
		timestamp: null,
	});
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

		const fetchChatHistory = async () => {
			const chatHistory = await makeApiCall(apiEndpoints.getChatHistory);
			console.log(
				"Chat history: ",
				chatHistory.history.chatHistory.entries
			);
			setMessages(chatHistory.history.chatHistory.entries);
		};

		fetchChatHistory();

		return () => {
			newSocket.close();
		};
	}, []);

	const sendMessage = useCallback((e) => {
		e.preventDefault();

		const appendToHistory = async () => {
			await makeApiCall(
				apiEndpoints.saveChatHistory,
				{},
				{
					username: username,
					entry: messageRef.current.value,
					timestamp: new Date(),
				}
			);
		};

		if (message.message.trim() && socket) {
			socket.emit("message", {
				username: username,
				message: messageRef.current.value,
				timestamp: new Date(),
			});
			appendToHistory();
			setMessage({
				username: username,
				message: null,
				timestamp: null,
			});
		}
	});

	const handleTyping = useCallback((e) => {
		setMessage({
			username: username,
			message: messageRef.current.value,
			timestamp: null,
		});

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
						<span>
							{message.username}: {message.message}
						</span>
					</div>
				))}
				{isTyping && <span>Someone is typing...</span>}
			</div>

			<form onSubmit={sendMessage}>
				<input
					type="text"
					value={message.message}
					ref={messageRef}
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
