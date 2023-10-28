import { relayInit } from "nostr-tools";
import type { Relay } from "nostr-tools";

export async function initRelay():Promise<Relay|null>{
    console.log('Initializing relay...')
    let relay = relayInit('wss://relay.damus.io')

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