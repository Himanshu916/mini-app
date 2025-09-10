import React, { useEffect, useState } from "react"
import StatsCardTimer from "../../components/StatsCardTimer"

const startDate = new Date("2025-06-16T13:30:00Z")
const CountdownTimer = () => {
  const targetDate = new Date(
    new Date(startDate).getTime() + 150 * 24 * 60 * 60 * 1000
  )

  const calculateTimeLeft = () => {
    const now = new Date().getTime()
    const difference = targetDate.getTime() - now

    if (difference <= 0) {
      return {
        days: "000",
        hours: "00",
        minutes: "00",
        seconds: "00",
      }
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((difference / 1000 / 60) % 60)
    const seconds = Math.floor((difference / 1000) % 60)

    return {
      days: String(days).padStart(3, "0"),
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
    }
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className=" text-white  px-6  flex items-center justify-center space-x-[.875rem] text-center">
      <StatsCardTimer label="Days" stats={timeLeft.days} />
      <div className="text-3xl font-bold">:</div>
      <StatsCardTimer label="Hours" stats={timeLeft.hours} />
      <div className="text-3xl font-bold">:</div>
      <StatsCardTimer label="Minutes" stats={timeLeft.minutes} />
    </div>
  )
}

export default CountdownTimer
