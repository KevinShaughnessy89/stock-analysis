import { useEffect,useState } from 'react';
import { getSymbols } from './apis.js';
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from "@/components/ui/command"
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
   
function GraphController({ onSymbolSelect , selectedSymbol }) {

    const [symbolList, setSymbolList] = useState([]);
    const [startDate, setStartDate] = useState(new Date('2024-10-15'));
    const [endDate, setEndDate] = useState(new Date('2024-10-22'));
    const [isLoading, setIsLoading] = useState(true);
    const [open, setOpen] = useState(false);

    useEffect( () => {

        const fetchData = async () => {
            try {
                setIsLoading(true);
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

        void fetchData();

    }, []);

    if (isLoading || !symbolList.length) {
        return (<div>Loading...</div>);
    }


    return (
        <div>
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                    {selectedSymbol ? symbolList.find((item) => item.value === selectedSymbol.value)?.label : "Search symbols..."}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search symbols..." />
                    <CommandList>
                        <CommandEmpty>No symbol found.</CommandEmpty>
                        <CommandGroup>
                            {symbolList.map((item) => (
                                <CommandItem key={item.value} value={item.value}
                                             onSelect={(currentValue) => {
                                                 onSymbolSelect(currentValue === item.value ? "" : item.label);
                                                 setOpen(false);
                                             }}>
                                <Check className={`mr-2 h-4 w-4 ${selectedSymbol === item.value ? "opacity-100" : "opacity-0"}`}/>
                                {item.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
        </div>
    );
}

export default GraphController;