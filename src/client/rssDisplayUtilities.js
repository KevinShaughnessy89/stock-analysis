import { makeApiCall } from '../common/makeApiCall.js';
import { apiEndpoints } from './apiEndpoints.js';

export async function getRssFeed(url) {

    const data = await makeApiCall(apiEndpoints.getRSS, { rss_url: url })
    
    const processedData = data.items.map((article) => ({
        title: article.title,
        description: article.description,
        author: article.author,
        link: article.link
    }));

    return processedData;
}

export async function saveFeedItem(feedItem) {
    console.log("feed item:" , feedItem);
    await makeApiCall(apiEndpoints.saveFeedItem, {}, feedItem );
}