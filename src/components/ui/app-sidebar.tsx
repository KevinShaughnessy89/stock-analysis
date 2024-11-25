import { LineChart, Home, Inbox, Settings, SpeechIcon } from "lucide-react"
import UserDisplay from "@/client/UserDisplay.js";
import { Separator } from '@/components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const items = [
    {
        title: "Analytics",
        url: "/analytics",
        icon: LineChart
    },
    {
        title: "RSS",
        url: '/rss',
        icon: Inbox
    },
    {
        title: 'Preferences',
        url: '/preferences',
        icon: Settings
    },
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: Home
    },
    {
        title: 'Chat',
        url: '/chat',
        icon: SpeechIcon
    },
]

export function AppSidebar() {
    return (
        <aside className="dark">
            <Sidebar>
                <SidebarContent>
                <SidebarGroup>

                    <div className="flex w-full flex-col">
                        <SidebarGroupLabel className="flex-col w-full">
                            <UserDisplay />
                            <Separator orientation="horizontal" className="mt-4 mb-2 w-full" />
                        </SidebarGroupLabel>
                        <SidebarGroupContent className="mt-5">
                        <SidebarMenu className="">
                            {items.map((item) => (
                            <SidebarMenuItem className="" key={item.title}>
                                <SidebarMenuButton asChild>
                                <a href={item.url}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                        </SidebarGroupContent>
                    </div>
                    

                </SidebarGroup>
                </SidebarContent>
            </Sidebar>
      </aside>
    );
}

export default AppSidebar;