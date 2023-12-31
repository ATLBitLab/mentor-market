"use client"
import Image from "next/image"
import mentorMarketIcon from "../public/mentor-market-icon.jpg"
import Button from "@/components/Button"
import { useUserDataStore } from "@/components/Layout"
import { initRelay, extractLessonFromEvent } from "@/lib/nostr"
import LessonCard from "@/components/LessonCard"
import { useEffect, useState } from "react"

export default function Home() {
  const userDataStore = useUserDataStore()
  const [isClient, setIsClient] = useState(false)
  const [lessons, setLessons] = useState<any[]>([])
  

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

  useEffect(() => {
    console.log('useEffect')
    setIsClient(true)
    if(!lessons.length) {
      initRelay('wss://nostr.mentors.atlbitlab.com').then((relay) => {
        console.log('connected to relay')
        if(!relay) return null
        // Create event, send, and subscribe to see it
        let sub = relay.sub([
          {
            kinds: [1],
          },
        ])

        sub.on('event', event => {
            setLessons((prevLessons) => {
              if (prevLessons.some(lesson => lesson.id === event.id)) {
                  console.log('already have ', event.id);
                  return prevLessons;
              }
              return [...prevLessons, event];
          });
        })
        
        sub.on('eose', () => {
          console.log('unsubscribing from relay')
          sub.unsub()
        })
      })
    }
  }, [])

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="text-center flex flex-col-reverse gap-8 items-center">
          <h1 className="font-medium text-sky-800">Mentor Market</h1>
          <Image src={mentorMarketIcon} alt="Mentor Market Logo" width={120} className="w-full max-w-[120px]" />
        </div>
        <div className="text-center flex flex-col gap-8 items-center">
          <p className="text-center text-xl">
            Welcome to Mentor Market. You know something valuable &mdash; sell your wisdom over Nostr and earn Bitcoin!
          </p>
          
          {isClient && userDataStore.npub ?
            <p className="text-center text-xl font-semibold text-purple-700">Welcome back, {userDataStore.name}</p>
          :
            <Button onClick={loginWithNip7}>Login Here</Button>
          }

          <p className="max-w-md">
            <small><a href="https://nostr.mentors.atlbitlab.com" className="underline" target="_blank">Join the Mentor Market relay</a> for only 21 sats in order to post lessons here</small>
          </p>
          
          <h2 className="text-pink-600">Available Lessons</h2>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {!lessons.length ?
              <>
                <LessonCard className="col-span-1 w-full" />
                <LessonCard className="col-span-1" />
                <LessonCard className="col-span-1" />
                <LessonCard className="col-span-1" />
              </>
            :
              lessons.map((event, i) => {
                let lesson = extractLessonFromEvent(event)
                if(lesson) return <LessonCard key={i} lesson={lesson} id={event.id} className="col-span-1" />
                else return null
              })
            }
          </div>
        </div>
      </div>
      
    </>
  )
}
