const stockQueryConfigs = {
	averageDailyPrice: {
		collection: "daily_price",
		params: {
			symbol: true,
			startDate: true,
			endDate: true,
		},
		pipeline: [
			{
				$match: {
					symbol: NaN,
					timestamp: {
						$gte: new Date(NaN),
						$lte: new Date(NaN),
					},
				},
			},
			{
				$group: {
					_id: null,
					averageOpen: { $avg: "$open" },
					averageHigh: { $avg: "$high" },
					averageLow: { $avg: "$low" },
					averageClose: { $avg: "$close" },
					averageVolume: { $avg: "$volume" },
				},
			},
		],
	},
	rawPriceData: {
		collection: "daily_price",
		params: {
			symbol: true,
			startDate: true,
			endDate: true,
		},
		pipeline: [
			{
				$match: {
					symbol: NaN,
					timestamp: {
						$gte: new Date(NaN),
						$lte: new Date(NaN),
					},
				},
			},
			{
				$group: {
					_id: null,
					allData: {
						$push: "$$ROOT",
					},
				},
			},
		],
	},
	getSymbols: {
		collection: "daily_price",
		params: {},
		pipeline: [
			{
				$group: {
					_id: "$symbol",
				},
			},
			{
				$project: {
					_id: 0,
					value: "$_id",
					label: "$_id",
				},
			},
		],
	},
};

export default stockQueryConfigs;
