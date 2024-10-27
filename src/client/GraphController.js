import { useEffect,useState } from 'react';
import { getSymbols } from './apis.js';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import './GraphController.css';

function GraphController({ onSymbolSelect }) {

    const [symbolList, setSymbolList] = useState([]);
    const [startDate, setStartDate] = useState(new Date('2024-10-15'));
    const [endDate, setEndDate] = useState(new Date('2024-10-22'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect( () => {

        const fetchData = async () => {
            try {
                console.log("1");
                setIsLoading(true);
                console.log('2');
                const symbols = await getSymbols();
                console.log('Symbols received:', symbols); // Check what we're getting
                setSymbolList(symbols);            
                return;
            } catch (error) {        
                console.error("Error creating symbol menu: ", error);
                setSymbolList([]);
                return;
            } finally {
                setIsLoading(false);
            }
        }

        console.log("do we at least get here?");

        void fetchData();

    }, []);

    if (isLoading || !symbolList.length) {
        return (<div>Loading...</div>);
    }

    console.log('Current symbolList:', symbolList); // Check state
    console.log('isLoading:', isLoading); // Check loading state

    return (
        <div className='select-container'>
            <Select>
                <SelectTrigger className='select-trigger'>
                    <SelectValue placeholder="Select Symbol" />
                </SelectTrigger>
                <SelectContent className='select-content'>
                    {symbolList.map((item) => (
                        <SelectItem key={item.symbol} value={item.symbol} className='select-item'>
                            {item.symbol}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

export default GraphController;
