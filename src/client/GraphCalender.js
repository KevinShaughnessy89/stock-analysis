import { useState, useEffect } from 'react';
import { addDays, format, isValid } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function GraphCalender({onStartDateChange, onEndDateChange}) {

    const [date, setDate] = useState({
        from: new Date(2024, 9, 13),
        to: addDays(new Date(2024, 9, 20), 20)
    });

    useEffect(() => {
        console.log("date.from: ", date?.from, " valid:", isValid(date?.from));
        console.log("date.to: ", date?.to, " valid:", isValid(date?.to));
        onEndDateChange(date?.to);
        onStartDateChange(date?.from);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date])

    return (
        <div className="grid gap-2 ">
        <Popover>
            <PopoverTrigger asChild className="">
                <Button variant={"outline"} id="date"
                        className={`w-[280px] justify-start text-left font-normal  ${date ? "text-muted-foreground" : ""}`}>
                        <CalendarIcon className="mr-2 h-4 w-4 " />
                        {date?.from ? (
                            date.to ? (
                                <>
                                {format(date.from, "LLL dd, y")} -{" "} - {format(date.to, "LLL dd, y")}
                                </>
                            ) : (format(date.from, "LLL dd, y"))
                            ) : (
                            <span>Pick a date</span>
                            )
                        }
                   </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 " align="start">
                <Calendar mode="range" selected={date} onSelect={setDate} initalFocus defaultMonth={date?.from} numberOfMonths={2}/>
            </PopoverContent>
        </Popover>
        </div>
    )
}

export default GraphCalender;