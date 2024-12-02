import {
	useEffect,
	useState,
	useCallback,
	useRef,
	useLayoutEffect,
} from "react";
import { io } from "socket.io-client";
import { postData, getData } from "@/common/makeApiCall.js";
import { apiEndpoints } from "./apiEndpoints.js";
import { useAuthStore } from "./authStore.js";
import { MessagesSquare, MessageSquareReply } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMenu from "./ChatMenu.js";
import { useChatStore } from "./chatStore.js";

const ChatComponent = () => {
	const { username } = useAuthStore();
	const { currentRoom } = useChatStore();

	console.log(`username: ${username}`);

	const messageRef = useRef(null);
	const messageEndRef = useRef(null);

	const [isOpen, setIsOpen] = useState(false);
	const [socket, setSocket] = useState(null);
	const [message, setMessage] = useState({
		username: username,
		message: "",
		timestamp: null,
	});
	const [messages, setMessages] = useState([]);
	const [isTyping, setIsTyping] = useState(false);
	const [typingTimeout, setTypingTimeout] = useState(null);

	const fetchChatHistory = async () => {
		const chatHistory = await getData(apiEndpoints.getChatHistory, {
			reqRoom: currentRoom,
		});
		console.log("Chat history: ", chatHistory.history);
		setMessages(chatHistory.history);
	};

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

		fetchChatHistory();

		return () => {
			newSocket.close();
		};
	}, []);

	const sendMessage = useCallback((e) => {
		e.preventDefault();

		const appendToHistory = async () => {
			await postData(apiEndpoints.saveChatHistory, {
				reqRoom: currentRoom,
				reqEntry: {
					username: username,
					message: messageRef.current.value,
					timestamp: new Date(),
				},
			});
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
				message: "",
				timestamp: null,
			});
		}
	});

	useEffect(() => {
		fetchChatHistory();
	}, [currentRoom]);

	useLayoutEffect(() => {
		if (messageEndRef.current && isOpen) {
			messageEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	useLayoutEffect(() => {
		if (messageEndRef.current && isOpen) {
			messageEndRef.current.scrollIntoView({ behavior: "instant" });
		}
	}, [isOpen]);

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
		<div className="w-[250px] h-[350px] flex flex-col">
			{isOpen ? (
				<div className="flex flex-col w-[100%] h-[80%] border">
					<div className="w-[100%] h-[80%]">
						<ScrollArea className="w-full h-full">
							{messages.map((message, index) => (
								<div key={index}>
									<span>
										{message.username}: {message.message}
									</span>
								</div>
							))}
							<div ref={messageEndRef} />
						</ScrollArea>
					</div>
					<div className="w-[100%] h-[20%]">
						<form
							onSubmit={sendMessage}
							className="flex flex-row h-full w-full"
						>
							<input
								type="text"
								value={message.message}
								ref={messageRef}
								onChange={handleTyping}
								placeholder="Type a message..."
								className="text-black h-full w-[80%]"
							/>
							<Button className="flex-1 h-full" type="submit">
								<MessageSquareReply />
							</Button>
						</form>
					</div>
				</div>
			) : (
				<div className="w-[100%] h-[80%] pointer-events-none bg-transparent"></div>
			)}
			<div className="flex w-[100%] h-[20%] justify-end">
				<div className="flex flex-row bg-black w-full h-full">
					<ChatMenu className="self-start" />
					<Button
						className="justify-end"
						onClick={() => {
							setIsOpen(!isOpen);
						}}
					>
						<MessagesSquare size={680} color="red" />
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ChatComponent;
