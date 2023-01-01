import { useRouter } from 'next/router'
import React from 'react'

export default function GatePassPrint() {
    const router = useRouter()
  return (
    <div>{router.query.sid}</div>
  )
}
