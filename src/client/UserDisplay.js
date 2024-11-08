import LoginDialog from './LoginDialog.js';
import { Skeleton } from '@/components/ui/skeleton'
import UserDropdownMenu from './UserDropDownMenu.js';
import UserAvatar from './UserAvatar.js';
import { useState, useEffect } from 'react'
import { makeApiCall } from '../common/makeApiCall.js';
import { apiEndpoints } from './apiEndpoints.js';

export function UserDisplay({className = ""}) {

    const [username, setUsername] = useState("Guest");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = (async () => {
            try {
                const data = await makeApiCall(apiEndpoints['getUserInfo'], {
                    fields: 'username'
                });

                if (!data) {
                    setUsername("Guest");
                } else {
                    setUsername(data.username)
                }
            }
            catch (error) {

            } finally {
                setLoading(false)
            }
        })

        fetchData();

    }, [])

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
            <UserAvatar username={username}/>
            <UserDropdownMenu username={username}/>
            <LoginDialog />
        </div>
    );
}

export default UserDisplay;