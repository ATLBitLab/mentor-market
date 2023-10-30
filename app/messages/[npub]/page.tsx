"use client"
import { initRelay, getInstructor } from "@/lib/nostr"
import { useEffect, useState } from "react"

export default function ConversationPage({params}: {params: {npub: string}}) {
const [profile, setProfile] = useState<Object|null>(null)

    useEffect(() => {
        let instructorProfile = getInstructor(params.npub)
        console.log(instructorProfile)
        setProfile(instructorProfile)
    }, [])

    return(
        <>
            Conversation with {profile && profile.name ? profile.name :  <span>Nostr Rando</span>}
        </>
    )
}