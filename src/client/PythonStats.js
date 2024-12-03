import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

const PythonStats = ({ graphState }) => {
	const StatsWindow = () => {
		return (
			<ScrollArea className="h-72 w-48 overflow-auto border-4 border-white">
				{graphState?.python?.map((element, index) => (
					<div key={index}>
						{Object.entries(element).map(([key, value]) => (
							<p
								key={key}
							>{`${key.toUpperCase()}: ${JSON.stringify(
								value
							)}`}</p>
						))}
					</div>
				))}
			</ScrollArea>
		);
	};

	const WindowSkeleton = () => {
		return <Skeleton className="h-72 w-48 border-2 border-white" />;
	};

	return <>{graphState?.isValid ? <StatsWindow /> : <WindowSkeleton />}</>;
};

export default PythonStats;
