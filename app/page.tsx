"use client"
import { generatePrivateKey, getPublicKey } from 'nostr-tools'
import { useState, useEffect } from 'react'


export default function Home() {
  const [sk, setSk] = useState('')
  const [pk, setPk] = useState('')

  let secretKey = generatePrivateKey()
  let publicKey = getPublicKey(secretKey)

  useEffect(() => {
    setSk(secretKey)
    setPk(publicKey)
    console.log(secretKey)
    console.log(publicKey)
  }, [])

  return (
    <main>
      <p>{pk}</p>
      <p>{sk}</p>
    </main>
  )
}
