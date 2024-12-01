import {
	DropdownMenuSubContent,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuLabelSeperator,
	DropdownMenuSubTrigger,
	DropdownMenuSub,
	DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, House, HousePlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { makeApiCall } from "@/common/makeApiCall.js";
import { apiEndpoints } from "./apiEndpoints.js";

const ChatMenu = ({ setRoomList, className = "" }) => {
	const updateRoomList = () => {
		const result = makeApiCall(apiEndpoints.getRoomList);
		if (result.success) {
			setRoomList(result.payload);
		}
	};

	return (
		<DropdownMenu className={className}>
			<DropdownMenuTrigger asChild>
				<Button>
					<MoreHorizontal />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<House />
						<span>Chat Rooms</span>
					</DropdownMenuSubTrigger>
					<DropdownMenuPortal>
						<DropdownMenuSubContent>
							<DropdownMenuItem>
								<Button onClick={updateRoomList}>
									<HousePlus />
									<span>Create Room</span>
								</Button>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Search />
								<span>Find Room</span>
							</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuPortal>
				</DropdownMenuSub>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ChatMenu;
