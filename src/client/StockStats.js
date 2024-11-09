import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

const StockStats = ( {graphState, symbol} ) => {

    return (
        <Table>
            <TableHeader>
                <TableCaption>Average price data for {symbol}</TableCaption>
                <TableRow>
                    <TableHead>High</TableHead>
                    <TableHead>Low</TableHead>
                    <TableHead>Open</TableHead>
                    <TableHead>Close</TableHead>
                    <TableHead>Volume</TableHead>
                </TableRow>
            </TableHeader>
            {graphState.isValid && (
                <TableBody>
                    <TableRow>
                        <TableCell>{graphState.averages[0]?.averageHigh.toFixed(2)}</TableCell>
                        <TableCell>{graphState.averages[0]?.averageLow.toFixed(2)}</TableCell>
                        <TableCell>{graphState.averages[0]?.averageOpen.toFixed(2)}</TableCell>
                        <TableCell>{graphState.averages[0]?.averageClose.toFixed(2)}</TableCell>
                        <TableCell>{graphState.averages[0]?.averageVolume.toFixed(2)}</TableCell>
                    </TableRow>
                </TableBody>
            )}
        </Table>
    )
}

export default StockStats;