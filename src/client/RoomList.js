import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { getData } from "@/common/makeApiCall.js";
import { apiEndpoints } from "./apiEndpoints.js";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Search } from "lucide-react";
import { useChatStore } from "./chatStore.js";

const RoomList = () => {
	const { setRoomName } = useChatStore();

	const [roomList, setRoomList] = useState([]);
	const [isOpen, setIsOpen] = useState(false);

	const refreshRoomList = async () => {
		const result = await getData(apiEndpoints.getRoomList, {});
		if (result.success) {
			setRoomList(result.payload);
		}
	};

	useEffect(() => {
		refreshRoomList();
	}, []);

	const handleSelect = (e) => {
		e.preventDefault();
		setIsOpen(true);
	};

	const handleRoomSelect = (item) => {
		setRoomName(item.name);
	};

	return (
		<div>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger asChild>
					<DropdownMenuItem onSelect={handleSelect}>
						<Button variant="outline" className="w-full">
							<Search />
							<span>Find Room</span>
						</Button>
					</DropdownMenuItem>
				</DialogTrigger>
				<DialogContent>
					<Command>
						<CommandInput placeholder="Search for room..." />
						<CommandList>
							<CommandEmpty>No rooms found.</CommandEmpty>
							<CommandGroup>
								{roomList.map((item) => (
									<CommandItem
										key={item.name}
										onSelect={() => {
											handleRoomSelect(item);
										}}
										className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
									>
										{item.name}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
					<Button onClick={refreshRoomList}>Refresh</Button>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default RoomList;
