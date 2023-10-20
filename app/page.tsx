"use client"
import { generatePrivateKey, getPublicKey } from 'nostr-tools'
import { useState, useEffect } from 'react'

export default function Home() {
  const [sk, setSk] = useState<string | null>('')
  const [pk, setPk] = useState<string | null>('')

  useEffect(() => {
    if( [null,''].includes(localStorage.getItem('sk')) ) {
      createKeys();
    }
    else {
      setSk(localStorage.getItem('sk'))
      setPk(localStorage.getItem('pk'))
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

  return (
    <main>
      <p>{sk}</p>
      <p>{pk}</p>
    </main>
  )
}
