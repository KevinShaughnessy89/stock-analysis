import { useEffect, useState } from 'react';
import { getRssFeed } from './rssDisplayUtilities.js';
import RSSFeedController from './RSSFeedController.js'
import RSSDisplay from './RSSDisplay.js';
import { rssFeeds } from './rssFeeds.js';

const RSSComponent = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [aggregateFeed, setAggregateFeed] = useState({});
    const [index, setIndex] = useState(0);

    const [article, setArticle] = useState({
        title: "",
        description: "",
        author: "",
        url: ""
    });

    const [feedConfig, setFeedConfig] = useState(Object.values(Object.values(rssFeeds)[0])[0]);


    useEffect(() => {

        const scrape = async () => {
            try {
                setIsLoading(true);
                const feedData = await getRssFeed(feedConfig.url);
                setAggregateFeed(feedData);
                setIndex(0);
                setArticle(feedData[0]);

            }
            catch (error) {
                console.error("Error getting website: ", error);                
            }
            finally {
                setIsLoading(false);
            }
        }

        scrape();

    }, [feedConfig])

    useEffect(() => {
        setArticle(aggregateFeed[index]);
    }, [index])


    return (
        <div>
            {!isLoading && (
                <div className="w-full h-full">
                    <RSSDisplay article={article} setIndex={setIndex} feedConfig={feedConfig} setFeedConfig={setFeedConfig} />    
                </div>
            )}
        </div>
    );
}

export default RSSComponent;