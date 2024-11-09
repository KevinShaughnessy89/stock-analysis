import { useEffect,useState } from 'react';
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react";
import { makeApiCall } from '../common/makeApiCall.js';
import { apiEndpoints } from './apiEndpoints.js';
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
   
function SymbolSelector({ onSymbolSelect , selectedSymbol }) {

    const [symbolList, setSymbolList] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect( () => {

        const fetchData = async () => {
            try {
                const response = await makeApiCall(apiEndpoints.getStockSymbols);
                console.log(response);
                setSymbolList(response);            
                return;
            } catch (error) {        
                console.error("Error creating symbol menu: ", error);
                setSymbolList([]);
                return;
            }
        }

        void fetchData();

    }, []);

    return (
        <div className="">
        <Popover open={open} onOpenChange={setOpen} className="">
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between ">
                    {selectedSymbol ? symbolList.find((item) => item.value === selectedSymbol)?.label : "Search symbols..."}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 ">
                <Command>
                    <CommandInput className="" placeholder="Search symbols..." />
                    <CommandList>
                        <CommandEmpty>No symbol found.</CommandEmpty>
                        <CommandGroup>
                            {symbolList.map((item) => (
                                <CommandItem className="" key={item.value} value={item.value}
                                             onSelect={(currentValue) => {
                                                 onSymbolSelect(selectedSymbol === item.value ? "" : currentValue);
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

export default SymbolSelector;