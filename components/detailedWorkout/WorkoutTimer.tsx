'use client'

import React, { useState, useEffect } from 'react'
import { Timer } from 'lucide-react'

const WorkoutTimer = ({started_at}: {started_at: Date}) => {


  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0)

  const updateTimer = async() => {

    const now = new Date()
    setElapsedSeconds(Math.floor((now.getTime() - started_at.getTime()) / 1000))
  }

  useEffect(() => {

    updateTimer()

    const interval = setInterval(updateTimer,1000)
    return () => clearInterval(interval)

  }, [])


  const formatTime =  (seconds:number) => {

    const hrs = Math.floor(seconds / 3600)
    const minute = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return [
      String(hrs).padStart(2,'0'),
      String(minute).padStart(2,'0'),
      String(secs).padStart(2,'0')
    ].join(':')
     
  }

  return (
    <div className="flex items-center gap-2 bg-surface border border-border px-3 py-1.5 rounded-full shadow-sm text-md font-mono font-semibold text-text">
      <Timer size={16} className="text-primary animate-pulse" />
      <span>{formatTime(elapsedSeconds)}</span>
    </div>
  )
}

export default WorkoutTimer
