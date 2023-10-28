"use client"
import Link from "next/link"
import Button from "./Button"
import { useEffect, useState } from "react"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UserDataStore {
    npub: string | null;
    name?: string;
    avatar?: string;
    setNpub: (newNpub:string) => void;
    getNpub: () => void;
}

export const useUserDataStore = create<UserDataStore>()(
    persist(
        (set, get) => ({
            npub: get() && get().npub ? get().npub : null,
            setNpub: (newNpub:string) => set(() => ({npub: newNpub})),
            getNpub: () => get().npub
        }),
        {
            name: 'user-storage'
        }
    )
)


interface LayoutProps {
    children: React.ReactNode
}

interface UserData {
    npub: string | null;
    name?: string;
    avatar?: string;
}

export default function Layout(props:LayoutProps){
    const userDataStore = useUserDataStore()
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, [])

    function loginWithNip7(){
        if(window && (window as any).nostr) {
            (window as any).nostr.getPublicKey().then((pubKey:string)=>{
                userDataStore.setNpub(pubKey)
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
                            {userDataStore.npub}
                        </>
                        :
                        <>  
                            <Button onClick={loginWithNip7}>
                                Login
                            </Button>
                        </>
                        )}
                    </div>
                    </nav>
                </header>
                {props.children}
            </div>
    )
}