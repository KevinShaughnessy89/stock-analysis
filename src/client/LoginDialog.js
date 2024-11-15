import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import UserTabs from './UserTabs.js'
import { LogIn } from "lucide-react";
import { Button } from '@/components/ui/button'

const LoginDialog = ({className = ""}) => {

    return (
        <div className={`${className}`}>
           <Dialog className="max-w-md mx-auto w-full">
                <DialogTrigger className="-mt2 -ml2 flex-shrink-0" asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-slate-100 rounded-full w-4 h-4 ">
                        <LogIn className="h-5 w-5" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="flex flex-col max-w-md mx-auto w-full">
                    <DialogHeader className="space-y-2">
                        <DialogTitle className="font-bold text-center text-white">Welcome</DialogTitle>
                        <DialogDescription className="text-center">Choose your preferred sign in method</DialogDescription>
                    </DialogHeader>
                    <UserTabs className="" />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default LoginDialog;