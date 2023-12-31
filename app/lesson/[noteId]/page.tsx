"use client"
import { initRelay } from "@/lib/nostr"
import { useState, useEffect } from "react"
import { extractLessonFromEvent, extractProfileFromEvent } from "@/lib/nostr"
import { LightningIcon } from "@bitcoin-design/bitcoin-icons-react/filled"
import { GlobeAltIcon } from '@heroicons/react/24/solid'
import Button from "@/components/Button"
import { nip19 } from "nostr-tools"
import { useRouter } from "next/navigation"

export default function LessonPage({params}: {params: {noteId: string}}){
    const [isClient, setIsClient] = useState(false)
    const [lessonEvent, setLessonEvent] = useState<any>(null)
    const [lesson, setLesson] = useState<any>(null)
    const [instructorEvent, setInstructorEvent] = useState<any>(null)
    const [instructor, setInstructor] = useState<any>(null)

    const router = useRouter()

    function routeTo(id:string|undefined){
        if(id) router.push('/lesson/' + id)
    }

    useEffect(() => {
        setIsClient(true)
        initRelay('wss://nostr.mentors.atlbitlab.com').then((relay) => {
        if(relay){
            console.log('connected to relay')
            // Create event, send, and subscribe to see it
            let sub = relay.sub([
                {
                    ids: [params.noteId]
                },
            ])

            sub.on('event', event => {
                console.log('got event:', event)
                setLessonEvent(event)
                let lesson = extractLessonFromEvent(event)
                console.log(lesson)
                if(lesson) setLesson(lesson)
                getInstructor(event)
            })

            console.log(event)

            sub.on('eose', () => {
                sub.unsub()
                
            })
        }
        })
    }, [])

    function getInstructor(event:any){
        console.log(event)
        initRelay('wss://relay.damus.io').then((relay) => {
            if(relay) {
                let sub = relay.sub([
                    {
                        kinds: [0],
                        authors: [event.pubkey]
                    },
                ])

                sub.on('event', event => {
                    console.log('got profile:', event)
                    setInstructorEvent(event)
                    let profile = extractProfileFromEvent(event)
                    console.log(profile)
                    setInstructor(profile)
                })

                sub.on('eose', () => {
                    sub.unsub()
                })
            }
        })
    }

    function dmInstructor(){
        console.log('dm instructor')
        let npub = nip19.npubEncode(instructorEvent.pubkey)
        let dmAddr = 'https://primal.net/messages/' + npub
        console.log(dmAddr)
        if(window) window.open(dmAddr, '_blank')
    }

    if(lesson) {
        return(
            <>
                <div className="flex flex-col gap-2 mb-4">
                    <img src={lesson.imageUrl} alt={lesson.title} className="w-full max-w-[160px] rounded-lg" />
                    <h1>{lesson.title}</h1>
                    <p className="text-xl">{lesson.price} <span className="text-lg">sats</span></p>
                    <p>{lesson.description}</p>
                    <Button onClick={()=>{dmInstructor()}}>Apply for Lesson</Button>
                </div>
                <div className="flex flex-col gap-2 p-4 border border-gray-200 rounded-md">
                    <p className="text-lg font-medium">Instructor</p>
                    {instructor ?
                        <div className="flex flex-row gap-2">
                            <a href={"https://nosta.me/" + instructorEvent.pubkey}><img src={instructor.picture} alt={instructor.name} className="w-16 h-16 rounded-full border border-gray-200" /></a>
                            <div className="flex flex-col gap-2">
                                <h2><a href={"https://nosta.me/" + instructorEvent.pubkey}>{instructor.display_name ? instructor.display_name : instructor.name ? instructor.name : instructorEvent.pubkey.slice(0,4) + "..." + instructorEvent.pubkey.slice(-4)}</a></h2>
                                <p>{instructor.about}</p>
                                {instructor.website && <p className="flex flex-row gap-2"><GlobeAltIcon className="w-6 h-6" /><a href={"https://" + instructor.website} className="underline">{instructor.website}</a></p>}
                                {instructor.lud16 && <p className="flex flex-row gap-2"><LightningIcon className="w-6 h-6" /><span>{instructor.lud16}</span></p>}
                            </div>
                        </div>
                    : ``}
                </div>
            </>
        )
    }
    else {
        return(
            <>Loading...</>
        )
    }
    
}