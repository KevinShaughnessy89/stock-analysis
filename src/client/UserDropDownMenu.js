import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
  } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { makeApiCall } from "@/common/makeApiCall.js";
import { apiEndpoints } from "./apiEndpoints.js";
import { useNavigate } from "react-router-dom";

export function UserDropdownMenu({className = "", username}) {

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await makeApiCall(apiEndpoints.logoutUser);
            navigate(0);
        }
        catch (error) {
            console.error("Error logging out: ", error);
        }
    }

    return (
        <DropdownMenu className={`${className}`}>
            <DropdownMenuTrigger asChild>
                <Button className="h-10 w-full pr-2" variant="outline"><span className="truncate">{username}</span></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onSelect={handleLogout}>
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserDropdownMenu;