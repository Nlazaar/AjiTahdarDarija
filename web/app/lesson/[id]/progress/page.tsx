import React from 'react'
import MinimalProgress from '../MinimalProgress'
import NewWordCard from '../NewWordCard'
import { redirect } from 'next/navigation'

export default function ProgressOnlyPage({ params }: { params: { id: string } }) {
  // If this is the 'Bases' lesson (l1) we redirect to the Alphabet lesson page
  if (params?.id === 'l1') {
    redirect('/alphabet')
  }

  const sample = { darija: 'ا', latin: 'a', fr: 'a' }
  return (
    <>
      <MinimalProgress value={25} />
      <main>
        <NewWordCard word={sample} />
      </main>
    </>
  )
}
