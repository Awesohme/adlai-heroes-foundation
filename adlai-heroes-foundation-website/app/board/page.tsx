'use client'

import Image from "next/image"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { supabaseApi } from "@/lib/supabase"
import { useState, useEffect } from "react"

export default function BoardPage() {
  const [boardMembers, setBoardMembers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadBoardMembers() {
      try {
        const members = await supabaseApi.getBoardMembers()
        setBoardMembers(members)
      } catch (error) {
        console.error('Error loading board members:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadBoardMembers()
  }, [])

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center text-center mb-12 rounded-lg overflow-hidden">
        <Image
          src="/placeholder.svg?height=400&width=1200"
          alt="Board members in a meeting"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
        />
        <div className="absolute inset-0 bg-black opacity-60 z-10" aria-hidden="true"></div>
        <h1 className="relative z-20 text-white text-4xl md:text-5xl font-bold drop-shadow-lg">Our Board</h1>
      </section>

      {/* Board Members Grid */}
      <section className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary mb-8">Meet Our Esteemed Board Members</h2>
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        ) : boardMembers.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
            {boardMembers.map((member, index) => (
              <Card variant="glass" key={member.id} className="p-6 flex flex-col items-center text-center shadow-lg w-[240px] flex-shrink-0">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  width={200}
                  height={200}
                  className="rounded-full object-cover mb-4 h-40 w-40"
                />
                <CardTitle className="text-xl font-semibold text-gray-900">{member.name}</CardTitle>
                <CardContent className="p-0 text-primary">{member.position}</CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">No board members available at this time.</div>
        )}
      </section>
    </div>
  )
}
