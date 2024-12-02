import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { postData } from "@/common/makeApiCall.js";
import { apiEndpoints } from "./apiEndpoints.js";
import { useAuthStore } from "./authStore.js";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { HousePlus } from "lucide-react";

function CreateRoom() {
	const { username } = useAuthStore();

	const [newRoomName, setNewRoomName] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	const createRoom = async () => {
		const result = postData(apiEndpoints.createRoom, {
			name: newRoomName,
			creator: username,
		});
		setIsOpen(false);
		setNewRoomName("");
	};

	const handleSelect = (e) => {
		e.preventDefault();
		setIsOpen(true);
	};

	return (
		<div>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger asChild>
					<DropdownMenuItem onSelect={handleSelect}>
						<Button variant="outline" className="w-full">
							<HousePlus />
							<span>Create Room</span>
						</Button>
					</DropdownMenuItem>
				</DialogTrigger>
				<DialogContent>
					<Input
						type="room-name"
						placeholder="Enter a room name..."
						value={newRoomName}
						onChange={(e) => setNewRoomName(e.target.value)}
					/>
					<Button onClick={createRoom}>Create</Button>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default CreateRoom;
