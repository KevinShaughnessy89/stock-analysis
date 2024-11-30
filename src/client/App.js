import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StockAnalysis from "./StockAnalysis.js";
import UserPreferences from "./UserPreferences.js";
import RSSComponent from "./RSSComponent.js";
import ChatComponent from "./ChatComponent.js";

function App() {
	return (
		<div className="m-6 w-full h-full">
			<BrowserRouter>
				<SidebarProvider>
					<div className="flex min-h-screen bg-background text-foreground  w-full h-full">
						<AppSidebar />
						<main className="flex-1 w-full ">
							<Routes>
								<Route
									path="/analytics"
									element={<StockAnalysis />}
								/>
								<Route path="/rss" element={<RSSComponent />} />
								<Route
									path="/preferences"
									element={<UserPreferences />}
								/>
								<Route
									path="/chat"
									element={<ChatComponent />}
								/>
							</Routes>
						</main>
					</div>
				</SidebarProvider>
			</BrowserRouter>
		</div>
	);
}

export default App;
