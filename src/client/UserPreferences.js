import { useEffect, useState } from 'react'
import { makeApiCall } from '@/common/makeApiCall.js';
import { apiEndpoints } from './apiEndpoints.js';

const UserPreferences = () => {

    const [savedFeeds, setSavedFeeds] = useState(null);

    useEffect(() => {

        const fetchPreferences = async () => {

            const response = await makeApiCall(apiEndpoints['getUserPreferences']);

            setSavedFeeds(response);
        }

        fetchPreferences();
    }, [])


    
    return (
        <p>{JSON.stringify(savedFeeds)}</p>
    )
}

export default UserPreferences;