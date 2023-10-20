"use client"
import { generatePrivateKey, getPublicKey, validateEvent, verifySignature, getSignature, getEventHash, signEvent, getBlankEvent, finishEvent } from 'nostr-tools'
import { useState, useEffect } from 'react'
import type { Event, EventTemplate, UnsignedEvent } from 'nostr-tools'

export default function Home() {
  const [sk, setSk] = useState<string | null>('')
  const [pk, setPk] = useState<string | null>('')
  const [eventContent, setEventContent] = useState<string>('')
  
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
      </>
      :
      <>
        Generating keys&hellip;
      </>
      }

      

      


    </main>
  )
}
