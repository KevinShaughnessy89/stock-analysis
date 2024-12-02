import {
	DropdownMenuSubContent,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, House } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getData } from "@/common/makeApiCall.js";
import { apiEndpoints } from "./apiEndpoints.js";
import CreateRoom from "./CreateRoom.js";
import RoomList from "./RoomList.js";

const ChatMenu = ({ className = "" }) => {
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
							<CreateRoom />
							<RoomList />
						</DropdownMenuSubContent>
					</DropdownMenuPortal>
				</DropdownMenuSub>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ChatMenu;
