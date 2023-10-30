"use client"
import { initRelay } from "@/lib/nostr"
import { useEffect } from "react"

export default function MessagesPage(){
    useEffect(() => {
        initRelay('wss://nostr.mentors.atlbitlab.com').then((relay) => {
            if(!relay) return null
            console.log('connected to relay')
            // Create event, send, and subscribe to see it
            let sub = relay.sub([
            {
                kinds: [4],
            },
            ])

            sub.on('event', event => {
                console.log('Found event:', event)
            });

            sub.on('eose', () => {
                console.log('unsubscribing from relay')
                sub.unsub()
            })
        })
    }, [])

    return(
        <>
            {/* Messages Page */}
            Messages list
        </>
    )
}