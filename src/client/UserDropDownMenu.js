import {
    DropdownMenu,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function UserDropdownMenu({className = "", username}) {

    return (
        <DropdownMenu className={`${className}`}>
            <DropdownMenuTrigger asChild>
                <Button className="h-10 w-full pr-2" variant="outline"><span className="truncate">{username}</span></Button>
            </DropdownMenuTrigger>
        </DropdownMenu>
    )
}

export default UserDropdownMenu;