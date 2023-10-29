"use client"
import Link from "next/link"
import Button from "./Button"
import { useEffect, useState } from "react"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { initRelay } from "@/lib/nostr"
import Image from "next/image"
import mentorMarketIcon from "../public/mentor-market-icon.jpg"
import MenuIcon from "@bitcoin-design/bitcoin-icons-react/filled/MenuIcon"

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
    const [menuOpen, setMenuOpen] = useState(false);

    const menuItems = [
        {
            name: "Lessons",
            href: "/"
        },
        {
            name: "Create Lesson",
            href: "/lesson/new"
        }
    ]

    useEffect(() => {
        setIsClient(true);
    }, [])

    useEffect(() => {
        console.log('menuOpen is ', menuOpen)
    }, [menuOpen])

    function logout(){
        console.log('logging out')
        userDataStore.logout()
    }

    function loginWithNip7(){
        if(window && (window as any).nostr) {
            (window as any).nostr.getPublicKey().then((pubKey:string)=>{
                userDataStore.setNpub(pubKey)

                let relay = initRelay('wss://relay.damus.io').then((relay)=>{
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
                <header className="w-full bg-white border-b border-gray-200 flex flex-row max-lg:flex-wrap lg:justify-between sticky z-50">
                    <div className="max-lg:w-full flex flex-row justify-between p-4">
                        <div className="flex flex-row gap-2 items-center">
                            <Image src={mentorMarketIcon} alt="" width={80} className="w-8 h-8"  />
                            <Link href="/" className="font-medium text-sky-800 sr-only md:not-sr-only">Mentor Market</Link>
                        </div>
                        <Button className="lg:hidden" onClick={()=> {setMenuOpen(!menuOpen)}}>
                            <MenuIcon className="w-6 h-6" />
                            <span className="sr-only" aria-hidden>Show Menu</span>
                        </Button>
                    </div>

                    <nav className={"max-lg:w-full flex flex-col-reverse lg:flex-row gap-2 max-lg:border-t border-gray-200" + (!menuOpen && " max-lg:hidden")}>
                        <ul className="max-lg:w-full flex flex-col lg:flex-row lg:gap-2 items-center">
                            {menuItems.map((item, index) => (
                                <li key={index} className="max-lg:w-full">
                                    <Link href={item.href} className="p-4 max-lg:border-b border-gray-200 block" onClick={()=>{setMenuOpen(false)}}>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div>
                            {isClient && (userDataStore && userDataStore.npub ?
                                <div className="p-4 flex flex-row gap-2 items-center w-full justify-end max-lg:border-b border-gray-200 lg:text-sm">
                                    <span className="lg:sr-only">Welcome,</span> <span className="font-semibold">{userDataStore.name}</span>
                                    <img src={userDataStore.avatar} className="w-8 h-8 rounded-full" />
                                    <Button onClick={logout}>
                                        Logout
                                    </Button>
                                </div>
                            :
                                <div className="p-4 flex flex-row gap-2 items-center w-full justify-end border-b border-gray-200"> 
                                    <Button onClick={loginWithNip7}>
                                        Login
                                    </Button>
                                </div>
                            )}
                        </div>
                    </nav>
                </header>
                <main className="p-4">
                    {props.children}
                </main>
                <div className={"bg-gray-900/50 w-full h-full absolute top-0 left-0 z-40" + (!menuOpen && " hidden")} onClick={()=>{setMenuOpen(false)}}></div>
            </div>
    )
}