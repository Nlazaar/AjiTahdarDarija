import React from 'react'

export default function FriendsPage() {
  const [requests, setRequests] = React.useState([])

  React.useEffect(() => {
    fetch((process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000') + '/friends/requests').then(r => r.json()).then(setRequests).catch(() => {})
  }, [])

  return (
    <div style={{ padding: 16 }}>
      <h1>Amis</h1>
      <h3>Demandes en attente</h3>
      <ul>{requests.map((r:any)=> <li key={r.id}>{r.fromId}</li>)}</ul>
    </div>
  )
}
