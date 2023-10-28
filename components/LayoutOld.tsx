"use client"
import Link from "next/link"
import Button from "./Button"
import { useEffect, useState } from "react"
import { createContext, useContext } from "react"
import { create } from "zustand"
import { persist, devtools, createJSONStorage } from "zustand/middleware"

interface UserDataStore {
    npub: string | null;
    name?: string;
    avatar?: string;
    setNpub: (newNpub:string) => void;
    getNpub: () => void;
}

const useUserDataStore = create<UserDataStore>()(
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






const UserContext = createContext<UserDataStore | null>(null)



export default function Layout(props:LayoutProps){
    const [userData, setUserData] = useState<UserData | null>(null)
    const userDataStore = useUserDataStore()
    const setNpub = useUserDataStore((state) => state.setNpub)
    console.log(userDataStore.npub)


    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, [])

    // useEffect(()=>{
    //     setNpub( useUserDataStore.g )
    // }, [])

    function loginWithNip7(){
        console.log('nostr nip7');
        if(window && (window as any).nostr) {
            (window as any).nostr.getPublicKey().then((pubKey:string)=>{
                console.log(pubKey)
                setUserData({npub: pubKey})
                userDataStore.setNpub(pubKey)
                console.log(userDataStore.npub  )
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
                            {/* {userDataStore.npub} */}
                            sdfsdfsdf
                        </>
                        :
                        <>  
                            {/* <Button onClick={loginWithNip7}>
                                Login
                            </Button> */}
                        </>
                        )}
                    </div>
                    </nav>
                </header>
                {props.children}
            </div>
    )
}