import { relayInit, getBlankEvent, finishEvent } from "nostr-tools";
import type { Relay, Event, EventTemplate, UnsignedEvent } from "nostr-tools";

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