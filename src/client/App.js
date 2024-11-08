import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StockAnalysis from "./StockAnalysis.js";
import UserRegistration from "./registration.js";
import Login from './Login.js'
import RSSComponent from "./RSSComponent.js";
import UserPreferences from './UserPreferences.js'
function App() {
    return (
        <BrowserRouter>
            <SidebarProvider>
                <div className="flex min-h-screen bg-background text-foreground  w-full h-full">
                    <AppSidebar />
                    <main className="flex-1 w-full ">
                        <SidebarTrigger />
                        <Routes>
                            <Route path='/analytics' element={<StockAnalysis />} />
                            <Route path='/rss' element={<RSSComponent />} />
                            <Route path='/preferences' element={<UserPreferences />} />
                        </Routes>
                    </main>
                </div>
            </SidebarProvider>
        </BrowserRouter>
    );
}

export default App;