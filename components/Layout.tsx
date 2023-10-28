"use client"
import Link from "next/link"
import Button from "./Button"
import { useEffect, useState } from "react"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { initRelay } from "@/lib/nostr"

interface UserDataStore {
    npub: string | null;
    name?: string;
    avatar?: string;
    setNpub: (newNpub:string) => void;
    setName: (newName:string) => void;
    setAvatar: (newAvatar:string) => void;
    getNpub: () => void;
    logout: () => void;
}

export const useUserDataStore = create<UserDataStore>()(
    persist(
        (set, get) => ({
            npub: get() && get().npub ? get().npub : null,
            setNpub: (newNpub:string) => set(() => ({npub: newNpub})),
            setName: (newName:string) => set(() => ({name: newName})),
            setAvatar: (newAvatar:string) => set(() => ({avatar: newAvatar})),
            getNpub: () => get().npub,
            logout: () => set(() => ({npub: null, name: undefined, avatar: undefined}))
        }),
        {
            name: 'user-storage'
        }
    )
)

interface LayoutProps {
    children: React.ReactNode
}

export default function Layout(props:LayoutProps){
    const userDataStore = useUserDataStore()
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, [])

    function logout(){
        console.log('logging out')
        userDataStore.logout()
    }

    function loginWithNip7(){
        if(window && (window as any).nostr) {
            (window as any).nostr.getPublicKey().then((pubKey:string)=>{
                userDataStore.setNpub(pubKey)

                let relay = initRelay().then((relay)=>{
                    console.log(relay)
                    // Get profile data
                if(relay){
                    console.log('fetching from relay')
                    let sub = relay.sub([
                    {
                        kinds: [0],
                        authors: [pubKey],
                    },
                    ])
            
                    sub.on('event', event => {
                        console.log('got event:', event)
                        let profile = JSON.parse(event.content)
                        console.log(profile)
                        userDataStore.setName(profile.name)
                        userDataStore.setAvatar(profile.picture)
                    })
                }
                else {console.log('relay not found')}

                })
                
                
            })
        }
    }

    return(
            <div>
                <header className="w-full p-4 border-b flex flex-row justify-between">
                    <Link href="/">Mentor Market</Link>
                    <nav className="flex flex-row gap-2">
                    <ul>
                        <li>
                        <Link href="/">Lessons</Link>
                        </li>
                    </ul>
                    <div>
                        {isClient && (userDataStore && userDataStore.npub ?
                        <>
                            Welcome, {userDataStore.name}
                            <img src={userDataStore.avatar} className="w-8 h-8 rounded-full" />
                            {userDataStore.npub}
                        </>
                        :
                        <>  
                            <Button onClick={loginWithNip7}>
                                Login
                            </Button>
                        </>
                        )}
                        <Button onClick={logout}>
                            Logout
                        </Button>
                    </div>
                    </nav>
                </header>
                {props.children}
            </div>
    )
}