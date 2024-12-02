import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const UserAvatar = ({ className = "", displayName }) => {
	return (
		<Avatar className={className}>
			<AvatarImage src="http://kevinshaughnessy.ca/avatar.png" />
			<AvatarFallback>{displayName}</AvatarFallback>
		</Avatar>
	);
};

export default UserAvatar;
