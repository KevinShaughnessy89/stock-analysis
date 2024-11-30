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

const ChatMenu = () => {
	return (
		<DropdownMenu>
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
								<HousePlus />
								<span>Create Room</span>
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
