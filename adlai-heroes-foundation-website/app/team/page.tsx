'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LinkedinIcon, MailIcon } from "lucide-react"
import { supabaseApi, type TeamMember } from "@/lib/supabase"
import { renderMarkdown } from "@/lib/markdown-renderer"

// Fallback team members data
const fallbackTeamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Adlai Heroes",
    position: "Founder & Executive Director",
    bio: "Passionate about creating positive change in communities and empowering the next generation of leaders.",
    image_url: "https://via.placeholder.com/300x300/1f2937/ffffff?text=Team+Member",
    email: "founder@adlaiheroesfoundation.com.ng",
    order_index: 1,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    name: "Program Director",
    position: "Programs & Operations Director",
    bio: "Leading our program development and ensuring effective implementation across all initiatives.",
    image_url: "https://via.placeholder.com/300x300/3b82f6/ffffff?text=Team+Member",
    order_index: 2,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(fallbackTeamMembers)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadTeamMembers() {
      try {
        const teamData = await supabaseApi.getTeamMembers()
        if (teamData.length > 0) {
          setTeamMembers(teamData)
        }
      } catch (error) {
        console.error('Error loading team members:', error)
        // Keep fallback data on error
      } finally {
        setIsLoading(false)
      }
    }

    loadTeamMembers()
  }, [])

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient-primary mb-6">Our Team</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Meet the dedicated individuals working tirelessly to create positive change in communities 
          and empower the next generation of leaders.
        </p>
      </section>

      {/* Team Members Grid */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member) => (
            <Card 
              key={member.id} 
              variant="glass" 
              className="shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <CardHeader className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <Image
                    src={member.image_url || "/placeholder.svg?height=300&width=300"}
                    alt={member.name}
                    fill
                    className="rounded-full object-cover border-4 border-gray-200 group-hover:border-primary transition-colors duration-300"
                  />
                </div>
                <CardTitle className="text-xl font-semibold text-gradient-primary">
                  {member.name}
                </CardTitle>
                <p className="text-primary font-medium">{member.position}</p>
              </CardHeader>
              <CardContent className="text-center">
                <div 
                  className="text-gray-700 mb-4 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(member.bio) }}
                />
                
                {/* Contact Links */}
                {(member.email || member.linkedin_url) && (
                  <div className="flex justify-center space-x-3">
                    {member.email && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="flex items-center gap-2"
                      >
                        <Link href={`mailto:${member.email}`}>
                          <MailIcon className="h-4 w-4" />
                          Email
                        </Link>
                      </Button>
                    )}
                    {member.linkedin_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="flex items-center gap-2"
                      >
                        <Link 
                          href={member.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <LinkedinIcon className="h-4 w-4" />
                          LinkedIn
                        </Link>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Join Our Team Section */}
      <section className="text-center bg-secondary py-16 rounded-lg">
        <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary mb-6">
          Join Our Team
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Are you passionate about making a difference? We're always looking for dedicated 
          individuals to join our mission of empowering communities and supporting children.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-adlaiGreen text-white hover:bg-adlaiGreen/90 shadow-lg hover:shadow-xl transform hover:scale-105 hover:rotate-12 transition-all duration-300">
            <Link href="/volunteer">Volunteer With Us</Link>
          </Button>
          <Button asChild variant="outline" className="shadow-lg hover:shadow-xl transform hover:scale-105 hover:rotate-12 transition-all duration-300">
            <Link href="/contact">Get In Touch</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}