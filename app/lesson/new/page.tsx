"use client"
import Input from "@/components/Input"
import { createUnsignedEvent, initRelay } from "@/lib/nostr"
import { useUserDataStore } from '@/components/Layout'
import type { Event } from "nostr-tools"
import { useState, useEffect } from "react"
import Button from "@/components/Button"
import type { Lesson } from "@/types/lesson"
import misc from  "@/public/lesson-cat-misc.jpg"
import cooking from  "@/public/lesson-cat-cooking.jpg"
import code from "@/public/lesson-cat-code.jpg"
import fitness from "@/public/lesson-cat-fitness.jpg"
import science from "@/public/lesson-cat-science.jpg"
import art from "@/public/lesson-cat-art.jpg"
import Image from "next/image"
import Category from "@/components/Category"
import type { StaticImageData } from "next/image"

export default function NewLesson(){
    const defaultLesson:Lesson = {
        title: "How to Use Nostr",
        description: "This is a test placeholder post for Mentor Market! Bitcoin ipsum dolor sit amet. Mining hash block height peer-to-peer soft fork timestamp server hash. Inputs, mempool Bitcoin Improvement Proposal whitepaper difficulty, nonce transaction! Transaction blockchain Satoshi Nakamoto segwit whitepaper satoshis hash key pair. Nonce?",
        imageUrl: "https://mentors.atlbitlab.com/default-lesson.jpg",
        price: 21000
    }

    type category = {
        name: string,
        slug: "misc"|"cooking"|"code"|"fitness"|"science"|"art",
        image: StaticImageData
    }

    const categories:category[] = [
        {
            name: "Miscellaneous",
            slug: "misc",
            image: misc
        },
        {
            name: "Art & Design",
            slug: "art",
            image: art
        },
        {
            name: "Code",
            slug: "code",
            image: code
        },
        {
            name: "Cooking",
            slug: "cooking",
            image: cooking
        },
        {
            name: "Fitness",
            slug: "fitness",
            image: fitness
        },
        {
            name: "Math & Science",
            slug: "science",
            image: science
        },
    ]

    const userDataStore = useUserDataStore()
    const [publishedLesson, setPublishedLesson] = useState<Event | null>(null)
    const [lessonTitle, setLessonTitle] = useState<string>(defaultLesson.title)
    const [lessonDescription, setLessonDescription] = useState<string>(defaultLesson.description)
    const [lessonPrice, setLessonPrice] = useState<number>(defaultLesson.price)
    const [lessonImage, setLessonImage] = useState<string|undefined>(defaultLesson.imageUrl)
    const [selectedCategory, setSelectedCategoryy] = useState<"misc"|"cooking"|"code"|"fitness"|"science"|"art">("misc")

    useEffect(()=>{
        console.log(lessonTitle, lessonDescription, lessonPrice, lessonImage)
    }, [lessonTitle, lessonDescription, lessonPrice, lessonImage])

  

    function handlePostLessonClick(){
        let unsignedEvent = createUnsignedEvent(JSON.stringify({title: lessonTitle, description: lessonDescription, price: lessonPrice, imageUrl: lessonImage}))
        console.log(unsignedEvent)
        if(window && (window as any).nostr) (window as any).nostr.signEvent(unsignedEvent).then((signedEvent:Event)=>{
            console.log(signedEvent)
            initRelay('wss://nostr.mentors.atlbitlab.com').then((relay)=>{
                if(relay){
                    let event:Event = signedEvent
                    console.log(typeof event)

                    // Create event, send, and subscribe to see it
                    let sub = relay.sub([
                        {
                        kinds: [1],
                        authors: [userDataStore.npub || ''],
                        },
                    ])

                    sub.on('event', event => {
                        console.log('got event:', event)
                    })

                    relay.publish(signedEvent).then(() => {
                        console.log('event published')
                        setPublishedLesson(signedEvent)
                    })
                }
            })
        })
    }

    if(!publishedLesson){
        return(
            <>
                <h1>Create a New Lesson</h1>

                <form className="flex flex-col gap-4" onSubmit={(e)=>{e.preventDefault(); handlePostLessonClick()}}>
                    <Input value={lessonTitle} placeholder="Give a title to your lesson" label="Lesson Title" onChange={(e)=>{setLessonTitle(e.target.value)}} />
                    <Input value={lessonDescription} type="textarea" placeholder="Describe your lesson in about 50 words." label="Lesson Description" onChange={(e)=>{setLessonDescription(e.target.value)}} />
                    <Input value={lessonPrice} type="number" placeholder="21000" label="Your Price (in sats)" onChange={(e)=>{setLessonPrice(parseInt(e.target.value))}} />
                    
                    <h3>Category</h3>

                    <div className="flex flex-row flex-wrap lg:flex-row gap-4 items-center rounded-xl">
                        {categories.map((category, i)=>{
                            return <Category image={category.image} name={category.name} selected={selectedCategory === category.slug} onClick={()=>{setSelectedCategoryy(category.slug); setLessonImage('https://mentors.atlbitlab.com/lesson-cat-' + category.slug + '.jpg' );}} />
                        })}
                    </div>

                    <p className="max-w-md">
                        <small><a href="https://nostr.mentors.atlbitlab.com" className="underline" target="_blank">Join the Mentor Market relay</a> for only 21 sats in order to post lessons here</small>
                    </p>

                    <Input type="submit" value="Post Lesson" />
                </form>
            </>
        )
    }
    else {
        let content = JSON.parse(publishedLesson.content)
        return(
            <>
                <h1>Lesson posted!</h1>

                <div className="p-4 flex flex-col gap-4 border border-gray-200 rounded-lg mb-4">
                    <img src={content.imageUrl} alt="" className="w-64 h-64 rounded-lg" />

                    <h2>{content.title}</h2>

                    <p>{content.price} sats</p>

                    <p>{content.description}</p>
                </div>
                
                <Button onClick={()=>{setPublishedLesson(null)}}>Post Another Lesson</Button>
            </>
        )
    }
    
}