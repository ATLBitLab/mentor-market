"use client"
import { generatePrivateKey, getPublicKey, getBlankEvent, finishEvent, relayInit } from 'nostr-tools'
import { useState, useEffect } from 'react'
import type { Event, Relay } from 'nostr-tools'
import crypto from 'crypto'
import * as secp from '@noble/secp256k1'
import { Noto_Sans_Tangsa } from 'next/font/google'

function connectToRelay(relay:Relay){
  relay.connect()
}

export default function Home() {
  const [sk, setSk] = useState<string | null>('')
  const [pk, setPk] = useState<string | null>('')
  const [eventContent, setEventContent] = useState<string>('')
  const [relayUri, setRelayUri] =  useState<string>('wss://relay.damus.io')
  const [relay, setRelay] = useState<Relay | null>(null)
  const [dmEventContent, setDmEventContent] = useState<string>('')
  const [dmTarget, setDmTarget] = useState<string>('99894d7779521334cb49913e23381e196a1bb10e5be3eded8e1e9e0803fd866d')
  
  useEffect(() => {
    if( [null,''].includes(localStorage.getItem('sk')) ) {
      createKeys();
    }
    else {
      setSk(localStorage.getItem('sk'))
      setPk(localStorage.getItem('pk'))

      if(sk){
        // Testing event creation
        let event1 = createEvent('Hello World 1', sk)
        let event2 = createEvent('Hello World 2', sk)
        let event3 = createEvent('Hello World 3', sk)
        console.log(event1)
        console.log(event2)
        console.log(event3)
      }
    }

    let relay = relayInit(relayUri)

    relay.on('connect', () => {
      console.log(`Connected to relay ${relay.url}`)
    })

    relay.on('error', ()=>{
      console.log(`Error connecting to relay ${relay.url}`)
    })

    relay.connect().then(()=>{setRelay(relay)})
  }, [])

  

  function createKeys(){
    let secretKey = generatePrivateKey()
    let publicKey = getPublicKey(secretKey)
    setSk(secretKey)
    setPk(publicKey)
    console.log(secretKey)
    console.log(publicKey)
    localStorage.setItem('sk', secretKey)
    localStorage.setItem('pk', publicKey)
  }

  function createEvent(content: string, sk:string, kind:number = 1, created_at:number = Math.floor(Date.now() / 1000), tags:any[] = []):Event{
    let eventTemp = getBlankEvent(kind)
    eventTemp.content = content
    eventTemp.created_at = created_at
    if(tags) eventTemp.tags = tags
    console.log('eventTemp', eventTemp)
    let event = finishEvent(eventTemp, sk || '')
    console.log(event)
    return event;
  }

  function broadcastAndCreateEvent(content: string, sk:string, kind:number = 1, created_at:number = Math.floor(Date.now() / 1000), tags:any[] = []){
    let event = createEvent(content, sk, kind, created_at, tags)

    if(relay) {
      // Create event, send, and subscribe to see it
      let sub = relay.sub([
        {
          kinds: [1],
          authors: [pk?.toString() || ''],
        },
      ])

      sub.on('event', event => {
        console.log('got event:', event)
      })

      relay.publish(event).then(() => {
        console.log('event published')
        let events = relay.list([{kinds: [0,1]}])
        console.log(events)
        let checkEvent = relay.get({
          ids: [event.id],
        })
        console.log(event)
      })
    }
  }

  function sendDm(content: string, sk:string, created_at:number = Math.floor(Date.now() / 1000)){
    console.log(pk?.toString() || '', '02' + dmTarget)
    let sharedPoint = secp.getSharedSecret(pk?.toString() || '', '02' + dmTarget)
    let sharedX = sharedPoint.slice(1, 33)
    let iv = crypto.randomFillSync(new Uint8Array(16))
    var cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(sharedX),
      iv
    )
    let encryptedMessage = cipher.update(content, 'utf8', 'base64')
    encryptedMessage += cipher.final('base64')
    let ivBase64 = Buffer.from(iv.buffer).toString('base64')

    broadcastAndCreateEvent(encryptedMessage + '?iv=' + ivBase64, sk, 4, Math.floor(Date.now() / 1000), [['p', dmTarget]])
  }
  

  return (
    <main>
      {sk && pk ?
      <>
        <h1>Welcome back to Nostr!</h1>
        <h2>Make an Event</h2>

        <form>
          <input type="text" placeholder="Event Content" value={eventContent} onChange={(e)=>setEventContent(e.target.value)} />
          <button type="button" onClick={()=>createEvent(eventContent, sk)}>
            Make Event
          </button>
        </form>

        <h2>Edit Relay</h2>

        <form>
          <input type="text" placeholder="Relay" value={relayUri} onChange={(e)=>setRelayUri(e.target.value)} />
        </form>

        {relay ?
          <>
            Relay connected
            <h2>Broadcast Event</h2>
            <button type="button" onClick={()=>broadcastAndCreateEvent(eventContent, sk)}>
              Broadcast
            </button>

            <form className="border p-8 m-8">
              <h2>Send DM</h2>
              <input type="text" placeholder="Slide into the DMs" value={dmEventContent} onChange={(e)=>setDmEventContent(e.target.value)} className="border p-2" />
              <button type="button" onClick={()=>sendDm(dmEventContent, sk)}>
                Send DM
              </button>
            </form>
          </>
        :
          <>
            No relay connect
          </>
        } 
      </>
      :
      <>
        Generating keys&hellip;
      </>
      }

    </main>
  )
}
