"use client"
import { generatePrivateKey, getPublicKey, getBlankEvent, finishEvent, relayInit } from 'nostr-tools'
import { useState, useEffect } from 'react'
import type { Event, Relay } from 'nostr-tools'

function connectToRelay(relay:Relay){
  relay.connect()
}

export default function Home() {
  const [sk, setSk] = useState<string | null>('')
  const [pk, setPk] = useState<string | null>('')
  const [eventContent, setEventContent] = useState<string>('')
  const [relayUri, setRelayUri] =  useState<string>('wss://relay.damus.io')  
  
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

    relay.connect().then(()=>{
      let sub = relay.sub([
        {
          ids: ['d7dd5eb3ab747e16f8d0212d53032ea2a7cadef53837e5a6c66d42849fcb9027'],
        },
      ])

      sub.on('event', event => {
        console.log('we got the event we wanted:', event)
      })

      sub.on('eose', () => {
        sub.unsub()
      })

      
    })
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

  function createEvent(content: string, sk:string, kind:number = 1, created_at:number = Math.floor(Date.now() / 1000)):Event{
    let eventTemp = getBlankEvent(kind)
    eventTemp.content = content
    eventTemp.created_at = created_at
    let event = finishEvent(eventTemp, sk || '')
    console.log(event)
    return event;
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
      </>
      :
      <>
        Generating keys&hellip;
      </>
      }

    </main>
  )
}
