import { relayInit, getBlankEvent, finishEvent } from "nostr-tools";
import type { Relay, Event, EventTemplate, UnsignedEvent } from "nostr-tools";
import type { Lesson } from "@/types/lesson";

export async function initRelay(relayUri:string):Promise<Relay|null>{
    console.log('Initializing relay...')
    let relay = relayInit(relayUri)

    relay.on('connect', () => {
      console.log(`Connected to relay ${relay.url}`)
    })

    relay.on('error', ()=>{
      console.log(`Error connecting to relay ${relay.url}`)
    })

    try {
        await relay.connect()
        return relay
    }
    catch(e) {
        console.log('Failed to connect to relay: ', e )
        return null
    }
    relay.connect().then(()=>{
        return relay
    })

    return null;
}

export function createEvent(content: string, sk:string, kind:number = 1, created_at:number = Math.floor(Date.now() / 1000), tags:any[] = []):Event{
  let eventTemp = getBlankEvent(kind)
    eventTemp.content = content
    eventTemp.created_at = created_at
    if(tags) eventTemp.tags = tags
    let event = finishEvent(eventTemp, sk || '')
    return event;
}

export function createUnsignedEvent(content: string, kind:number = 1, tags:any[] = [], created_at:number = Math.floor(Date.now() / 1000)):EventTemplate{
  let eventTemp = getBlankEvent(kind)
  eventTemp.content = content
  eventTemp.created_at = created_at
  if(tags) eventTemp.tags = tags
  return eventTemp;
}

export function extractLessonFromEvent(event:Event, includeRawEvent:boolean = false):Lesson|null{
  try{
    let lesson = JSON.parse(event.content)
    return lesson
  }
  catch(e){
    // console.error('Error: ', e)
    return null
  }
}

export function extractProfileFromEvent(event:Event):Object|null{
  try{
    let profile = JSON.parse(event.content)
    return profile
  }
  catch(e){
    console.error('Error: ', e)
    return null
  }
}

export async function getInstructor(pubkey:string):Promise<Object>{
  let profile ={}
  initRelay('wss://relay.damus.io').then((relay) => {
      if(relay) {
        let sub = relay.sub([
          {
            kinds: [0],
            authors: [pubkey]
          },
        ])

        sub.on('event', event => {
            let profile = extractProfileFromEvent(event)
        })

        sub.on('eose', () => {
            sub.unsub()
        })
        return profile
      }
  })
  return profile
}