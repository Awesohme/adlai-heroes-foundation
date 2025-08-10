'use client'

import Image from "next/image"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { supabaseApi, type BoardMember } from "@/lib/supabase"
import { renderMarkdown } from "@/lib/markdown-renderer"
import { useState, useEffect } from "react"

export default function BoardPage() {
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([])
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
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-12 md:p-16 text-center shadow-2xl mb-16">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-indigo-500/20 to-blue-500/20 animate-pulse"></div>
        <div className="relative z-10">
          <div className="inline-block p-4 rounded-full bg-white/10 backdrop-blur-sm mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-white/20 to-white/30 flex items-center justify-center">
              <span className="text-3xl">👥</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">Our Board</h1>
          <p className="text-xl md:text-2xl text-white/90 drop-shadow max-w-2xl mx-auto">
            Meet the dedicated leaders guiding our mission to transform lives
          </p>
        </div>
        <div className="absolute top-6 right-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-6 left-6 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
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
            {boardMembers.map((member) => (
              <Card key={member.id} className="p-6 flex flex-col items-center text-center shadow-lg w-[240px] flex-shrink-0 bg-white/70 backdrop-blur-sm">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  width={200}
                  height={200}
                  className="rounded-full object-cover mb-4 h-40 w-40"
                />
                <CardTitle className="text-xl font-semibold text-gray-900 mb-2">{member.name}</CardTitle>
                <CardContent className="p-0 text-primary mb-4">{member.position}</CardContent>
                
                {member.bio && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-white/50 hover:bg-white/70 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:rotate-3"
                      >
                        View Bio
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-gradient-primary mb-2">
                          {member.name}
                        </DialogTitle>
                        <p className="text-lg text-primary font-medium mb-4">
                          {member.position}
                        </p>
                      </DialogHeader>
                      <div className="mt-4">
                        <div 
                          className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: renderMarkdown(member.bio) }}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
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