"use client"

import { Inter } from "next/font/google"
import Channel from "./Channel"

const inter = Inter({
  subsets: ["latin"],
  weight: "200",
})

export default function Section({ name, channels, logos }) {
  if (!channels || channels.length === 0) {
    return null
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-blue-700 mb-6">
        {name}
      </h2>

      <div className="flex gap-6 overflow-x-auto hide-scrollbar">
        {channels.map((i) => (
          <Channel
            key={i.id}
            id={i.id}
            imageUrl={
              logos.find((j) => i.id === j.channel)?.url
            }
          />
        ))}
      </div>
    </div>
  )
}