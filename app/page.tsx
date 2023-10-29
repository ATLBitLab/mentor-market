"use client"
import Image from "next/image"
import mentorMarketIcon from "../public/mentor-market-icon.jpg"
import Button from "@/components/Button"
import { useUserDataStore } from "@/components/Layout"
import { initRelay } from "@/lib/nostr"
import LessonCard from "@/components/LessonCard"
import { useEffect, useState } from "react"

export default function Home() {
  const userDataStore = useUserDataStore()
  const [isClient, setIsClient] = useState(false)
  const [lessons, setLessons] = useState<any[]>([])
  const [popularMentors, setPopularMentors] = useState<any[]>([])
  const [popularLessons, setPopularLessons] = useState<any[]>([])

  useEffect(() => {
    setIsClient(true)
    initRelay('wss://nostr.mentors.atlbitlab.com').then((relay) => {
      if(relay){
        // Create event, send, and subscribe to see it
        let sub = relay.sub([
          {
            kinds: [1],
          },
        ])

        sub.on('event', event => {
            console.log('got event:', event)
            setLessons((lessons) => [...lessons, event])
        })
      }
    })
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
            <Button>Login Here</Button>
          }

          <h2 className="text-pink-600">Popular Lessons</h2>

          <p><em>Popular lessons will go here</em></p>

          <h2 className="text-pink-600">Popular Mentors</h2>

          <p><em>Popular mentors will go here</em></p>
          
          <h2 className="text-pink-600">All Lessons</h2>
          {!lessons.length ?
            <>
              <LessonCard />
              <LessonCard />
              <LessonCard />
              <LessonCard />
            </>
          :
            lessons.map((event, i) => {
              try{
                let lesson = JSON.parse(event.content)
                return <LessonCard key={i} lesson={lesson} id={event.id} />
              }
              catch(e){
                console.error('Error: ', e)
                return null
              }
            })
          }
        </div>
      </div>
      
    </>
  )
}
