import { useEffect,useState } from 'react';
import { getSymbols } from './apis.js';

async function GraphController({ onSymbolSelect }) {

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
        <details>
            <summary>Select Symbol</summary>
            <div className="drop-menu">
                {/* { {symbolList.map((item) => (
                    <button key={item.symbol} onClick={() => {
                        console.log("In the map");
                        onSymbolSelect(item.symbol);
                    }}>{item.symbol}</button>} */}
            </div>
        </details>
    )
}

export default GraphController;
