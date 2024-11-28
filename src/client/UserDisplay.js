import LoginDialog from "./LoginDialog.js";
import { Skeleton } from "@/components/ui/skeleton";
import UserDropdownMenu from "./UserDropDownMenu.js";
import UserAvatar from "./UserAvatar.js";
import { useState, useEffect } from "react";
import { makeApiCall } from "../common/makeApiCall.js";
import { apiEndpoints } from "./apiEndpoints.js";
import { useAuthStore } from "./authStore.js";

export function UserDisplay({ className = "" }) {
	const { username } = useAuthStore();

	const [displayName, setDisplayName] = useState(username);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setDisplayName(username);
		setLoading(false);
	}, [username]);

	if (loading) {
		return (
			<div className="flex items-center gap-2">
				<Skeleton className="h-10 w-10 rounded-full" />
				<Skeleton className="h-10 w-24" />
			</div>
		);
	}

	return (
		<div className={`w-full flex flex-row items-center gap-4 ${className}`}>
			<UserAvatar displayName={displayName} />
			<UserDropdownMenu displayName={displayName} />
			<LoginDialog />
		</div>
	);
}

export default UserDisplay;
