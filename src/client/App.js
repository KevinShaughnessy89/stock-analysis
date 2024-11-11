import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Dashboard from "./Dashboard.js";
import { useAuthStore } from "./authStore.js";
import StockAnalysis from "./StockAnalysis.js";
import UserPreferences from './UserPreferences.js'
import RSSComponent from "./RSSComponent.js";
import { makeApiCall } from "@/common/makeApiCall.js";
import { apiEndpoints } from "./apiEndpoints.js";
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

function App() {

    useEffect(async () => {

        const checkAuthStatus = async () => {
            try {
                const response = await makeApiCall(apiEndpoints.verifyCookie);
            }
            catch (error) {
                console.error("Error verifying cookie: ", error)
            }
        }

        checkAuthStatus();

        return (useAuthStore.getState().logout());
    }, []);

    return (
        // <div className='m-6'>
            <BrowserRouter>
                <SidebarProvider>
                    <div className="flex min-h-screen bg-background text-foreground  w-full h-full">
                        <AppSidebar />
                        <main className="flex-1 w-full ">
                            <Routes>
                                <Route path='/analytics' element={<StockAnalysis />} />
                                <Route path='/rss' element={<RSSComponent />} />
                                <Route path='/preferences' element={<UserPreferences />} />
                            </Routes>
                        </main>
                    </div>
                </SidebarProvider>
            </BrowserRouter>
        // </div>
    );
}

export default App;