const queryConfigs= {

    averageDailyPrice: {
        collection: 'daily_price',
        params: {
            symbol: true,
            startDate: true,
            endDate: true
        },
        pipleline : [
            {
                $match: {
                    symbol: symbol,
                    timestamp: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                }
            },
            {
            $group: {
                _id: null,
                averageOpen: { $avg: "$open" },
                averageHigh: { $avg: '$high' },
                averageLow: { $avg: '$low'},
                averageClose: { $avg: '$close'},
                averageVolume: { $avg: '$volume'}
                }
            }
            
            
        ]
    }
}