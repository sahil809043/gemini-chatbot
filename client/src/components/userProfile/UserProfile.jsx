import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Auth } from '../../config/firebase.config'


function UserProfile() {
    const userAvatar = Auth.currentUser?.photoURL || "";
    const displayName = Auth.currentUser.displayName;
    const userEmail = Auth.currentUser.email;
    const accountDate = Auth.currentUser.metadata.creationTime.substring(4, 16);

    const handleSignout = async () => {
        try {
            await Auth.signOut()
            window.localStorage.removeItem("token");
        } catch (error) {
            alert(error.message);
        }
    }
    return (
        <>
            <div className="userProfile">
                <Popover>
                    <PopoverTrigger className="cursor-pointer" asChild>
                        <Avatar>
                            <AvatarImage src={userAvatar} />
                            <AvatarFallback className="text-white font-ultra text-xl font-bold bg-[lightcoral]">{displayName.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h1 className="text-2xl font-gilroy font-medium leading-none">User Profile</h1>
                                <hr />
                            </div>
                            <div className="grid gap-2">
                                <div className="grid text-nowrap font-bold text-gray-500 grid-cols-3 items-center gap-4">
                                    <h3 className="font-gilroy">{displayName}</h3>
                                </div>
                                <div className="grid text-nowrap font-bold text-gray-500 grid-cols-3 items-center gap-4">
                                    <h3 className="font-gilroy">{userEmail}</h3>
                                </div>
                                <div className="grid text-nowrap font-bold text-gray-500 grid-cols-3 items-center gap-4">
                                    <h3 className="font-gilroy" id='accountDate'>Joined On - {accountDate}</h3>
                                </div>
                                <hr />
                                <div className="flex items-center justify-center">
                                    <Button className="font-gilroy" onClick={handleSignout}>
                                        Sign Out
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </>
    )
}

export default UserProfile