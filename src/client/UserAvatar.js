import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

export const UserAvatar = ({className = "", username}) => {
    
    return (
        <Avatar className={`${className}`}>
            <AvatarImage src="http://kevinshaughnessy.ca/avatar.png" />
            <AvatarFallback>{username == "Guest" ? "G" : username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
    );
}

export default UserAvatar;