import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import UserRegistration from "./registration.js"
import Login from "./Login.js"

export const UserTabs = ({className = ""}) => {
    return (
        <div className={`${className}`}>
            <Tabs defaultValue="login" className="flex flex-1 flex-col items-center justify-center w-full max-w-md"> {/* Add max-w-md or your preferred width */}
            <TabsList className="grid w-full grid-cols-2"> {/* Use grid instead of flex for equal width triggers */}
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="w-full">
                <Card className="w-full min-h-[400px]"> {/* Add fixed minimum height */}
                <CardHeader>
                    <CardTitle className="text-center font-bold">Login</CardTitle>
                    <CardDescription className="text-center">Login to your account here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Login />
                </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="register" className="w-full">
                <Card className="w-full min-h-[400px]"> {/* Same fixed minimum height */}
                <CardHeader>
                    <CardTitle className="text-center font-bold">Register</CardTitle>
                    <CardDescription className="text-center">Sign-in to your account here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <UserRegistration />
                </CardContent>
                </Card>
            </TabsContent>
            </Tabs>
        </div>
    )
}
  
export default UserTabs;