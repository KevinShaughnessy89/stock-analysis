import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { rssFeeds } from './rssFeeds.js';
import { saveFeedItem } from './rssDisplayUtilities.js';
import { useAuthStore } from './authStore.js';

const RSSFeedController = ({article, setIndex, feedConfig, setFeedConfig}) => {

    const isAuthenticated = useAuthStore(state => state.isAuthenticated);

    const nextClick = () => {
        setIndex(prevIndex => {
            if (prevIndex < 9) {
                return prevIndex + 1;
            } else {
                return 0;
            }
    })}

    const prevClick = () => {
        setIndex(prevIndex => {
            if (prevIndex > 0) {
                return prevIndex - 1;
            } else {
                return 9;
            }
    })}

    return (
        <div className="flex flex-row w-full h-full">
            <Button variant='outline' className='' onClick={prevClick}>Prev</Button>
            <Button variant='outline' className='' onClick={nextClick}>Next</Button>
            <DropdownMenu className='ml-12'>
                <DropdownMenuTrigger asChild>
                <Button variant="outline">{feedConfig.label}</Button>
                </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                        {Object.values(rssFeeds).map((categories) => 
                            Object.values(categories).map((feed) => (
                                <DropdownMenuItem
                                onSelect={() => {
                                    setFeedConfig({
                                    label: feed.label,
                                    url: feed.url
                                    })
                                }}>
                                <span>{feed.label}</span>
                                </DropdownMenuItem>
                            ))
                            )}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
            </DropdownMenu>
            {isAuthenticated && (<Button variant='outline' className='' onClick={() => saveFeedItem({
                title: article.title,
                link: article.link,
                description: article.description
            })}>Save</Button>)}
        </div>
    )
}

export default RSSFeedController;