import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import UserRegistration from './registration.js'
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button"

const RegisterDialog = () => {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-slate-100 rounded-full w-4 h-4">
                    <UserPlus className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="">
                <DialogHeader>
                    <DialogTitle>Register</DialogTitle>
                    <DialogDescription>Enter your information here to register.</DialogDescription>
                </DialogHeader>
                <UserRegistration />
            </DialogContent>
        </Dialog>
    )
}

export default RegisterDialog;