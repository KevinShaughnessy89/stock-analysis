import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./authStore.js";
import StockAnalysis from "./StockAnalysis.js";
import UserPreferences from "./UserPreferences.js";
import RSSComponent from "./RSSComponent.js";
// import { makeApiCall } from "@/common/makeApiCall.js";
// import { apiEndpoints } from "./apiEndpoints.js";
import ChatComponent from "./ChatComponent.js";

function App() {
	// const location = useLocation();
	// // Have to initialize these here, can't use react hooks in nested functions or conditionally
	// const { isAuthenticated, setIsAuthenticated, setUsername, logout } =
	// 	useAuthStore();

	// useEffect(() => {
	// 	const checkAuthStatus = async () => {
	// 		try {
	// 			const result = await makeApiCall(apiEndpoints.verifyCookie);
	// 			console.log("result: ", JSON.stringify(result));
	// 			if (result.success) {
	// 				if (!isAuthenticated) {
	// 					setIsAuthenticated(true);
	// 					setUsername(result.userInfo.username);
	// 				}
	// 			}
	// 		} catch (error) {
	// 			console.error("Error verifying cookie: ", error);
	// 		}
	// 	};

	// 	checkAuthStatus();

	// 	return () => {
	// 		logout();
	// 	};
	// }, [location]);

	return (
		<div className="m-6 w-full h-full">
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
							<Route path="/chat" element={<ChatComponent />} />
						</Routes>
					</main>
				</div>
			</SidebarProvider>
		</div>
	);
}

export default App;
