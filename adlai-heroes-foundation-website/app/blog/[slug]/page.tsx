'use client'

import Image from "next/image"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { supabaseApi } from "@/lib/supabase"
import type { BlogPost } from "@/lib/supabase"

// Fallback data for development
const fallbackBlogPostsData = [
  {
    id: "1",
    title: "Empowering Futures: Our Latest Educational Initiative",
    date: "July 25, 2024",
    author: "Adlai Heroes Team",
    image: "/placeholder.svg?height=400&width=800",
    content: `
      <p class="mb-4">We are thrilled to announce the launch of our newest educational initiative aimed at providing quality learning opportunities to children in remote and underserved communities. This program focuses on holistic development, ensuring that children not only receive academic support but also develop critical life skills.</p>
      <p class="mb-4">Our team has been working tirelessly over the past few months, collaborating with local educators and community leaders to tailor the curriculum to the specific needs of the children. We believe that education is the cornerstone of a brighter future, and every child deserves the chance to learn and grow.</p>
      <h3 class="text-2xl font-bold text-gradient-primary mb-4 mt-6">Key Highlights of the Initiative:</h3>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li><strong>Access to Resources:</strong> Providing textbooks, stationery, and digital learning tools.</li>
        <li><strong>Qualified Tutors:</strong> Engaging experienced teachers and volunteers for supplementary classes.</li>
        <li><strong>Safe Learning Environments:</strong> Renovating and equipping community learning centers.</li>
        <li><strong>Parental Involvement:</strong> Conducting workshops for parents to support their children's education at home.</li>
      </ul>
      <p class="mb-4">The initial phase of the program has already seen tremendous success, with over 150 children enrolled in our pilot communities. The enthusiasm from both children and parents has been overwhelming, reinforcing our commitment to this vital cause.</p>
      <p>We extend our heartfelt gratitude to our donors, volunteers, and partners whose unwavering support makes these initiatives possible. Together, we are building a generation of empowered individuals ready to shape their own destinies.</p>
    `,
  },
  {
    id: "2",
    title: "Health Outreach: A Day of Free Medical Check-ups",
    date: "July 18, 2024",
    author: "Adlai Heroes Team",
    image: "/placeholder.svg?height=400&width=800",
    content: `
      <p class="mb-4">Our recent health outreach program provided free medical check-ups and consultations to over 300 children and their families in [Community Name]. The event aimed to address immediate health concerns and promote preventative healthcare practices.</p>
      <p class="mb-4">Many children in these areas lack access to basic medical services. Our team of volunteer doctors, nurses, and health workers conducted general health screenings, administered vaccinations, and provided essential medicines. We also focused on educating families about hygiene, nutrition, and common childhood illnesses.</p>
      <h3 class="text-2xl font-bold text-gradient-primary mb-4 mt-6">Impact of the Health Camp:</h3>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Early detection of health issues in children.</li>
        <li>Increased vaccination rates in the community.</li>
        <li>Improved awareness of healthy living practices.</li>
        <li>Distribution of vital medicines and supplements.</li>
      </ul>
      <p class="mb-4">The positive response from the community highlights the critical need for such initiatives. We are committed to continuing our health programs to ensure that every child has the opportunity to grow up healthy and strong.</p>
      <p>A big thank you to all our medical volunteers and partners for their invaluable contribution to this life-saving event.</p>
    `,
  },
  {
    id: "3",
    title: "Volunteer Spotlight: Meet Our Heroes",
    date: "July 10, 2024",
    author: "Adlai Heroes Team",
    image: "/placeholder.svg?height=400&width=800",
    content: `
      <p class="mb-4">Today, we shine a spotlight on one of our incredible volunteers, [Volunteer Name]. [Volunteer Name] has been with Adlai Heroes Foundation for [X] years, dedicating their time and passion to our educational programs.</p>
      <p class="mb-4">From tutoring children in mathematics to organizing recreational activities, [Volunteer Name]'s commitment has made a tangible difference in the lives of many. "Seeing the children's eyes light up when they understand a new concept or achieve a small victory is the most rewarding part," says [Volunteer Name].</p>
      <h3 class="text-2xl font-bold text-gradient-primary mb-4 mt-6">Why Volunteer?</h3>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Directly impact children's lives.</li>
        <li>Gain valuable experience and skills.</li>
        <li>Become part of a passionate community.</li>
        <li>Contribute to sustainable change.</li>
      </ul>
      <p class="mb-4">Our volunteers are the backbone of Adlai Heroes Foundation. Their selfless dedication enables us to reach more children and expand our programs. If you're inspired by [Volunteer Name]'s story, consider joining our team of heroes!</p>
      <p>Every hour you dedicate helps us build a brighter future. Thank you, [Volunteer Name], and all our amazing volunteers!</p>
    `,
  },
  {
    id: "4",
    title: "Community Development: Building a Brighter Tomorrow",
    date: "June 30, 2024",
    author: "Adlai Heroes Team",
    image: "/placeholder.svg?height=400&width=800",
    content: `
      <p class="mb-4">Our latest community development project in [Community Name] has successfully completed the construction of a new community center, providing a safe and accessible space for children's activities and adult literacy programs.</p>
      <p class="mb-4">This initiative was a collaborative effort involving local residents, volunteers, and our dedicated team. The center will serve as a hub for educational workshops, health awareness campaigns, and vocational training, fostering a stronger, more resilient community.</p>
      <h3 class="text-2xl font-bold text-gradient-primary mb-4 mt-6">Project Outcomes:</h3>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Creation of a multi-purpose community space.</li>
        <li>Increased opportunities for adult education and skill development.</li>
        <li>Enhanced community cohesion and participation.</li>
        <li>Improved access to resources for children and families.</li>
      </ul>
      <p class="mb-4">We believe that empowering communities from within is key to sustainable development. This project is a testament to what can be achieved when people come together for a common goal.</p>
      <p>We look forward to seeing the positive ripple effects of this new center for years to come.</p>
    `,
  },
  {
    id: "5",
    title: "The Power of Play: Our New Recreational Program",
    date: "June 20, 2024",
    author: "Adlai Heroes Team",
    image: "/placeholder.svg?height=400&width=800",
    content: `
      <p class="mb-4">Recognizing the importance of play in child development, we've launched a new recreational program designed to provide safe, engaging, and stimulating play spaces for children in underprivileged areas.</p>
      <p class="mb-4">Play is not just fun; it's crucial for cognitive, emotional, and social growth. Our program includes setting up playgrounds, organizing sports activities, and facilitating creative play sessions, ensuring children have a balanced childhood.</p>
      <h3 class="text-2xl font-bold text-gradient-primary mb-4 mt-6">Program Benefits:</h3>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Promotes physical health and active lifestyles.</li>
        <li>Enhances social skills and teamwork.</li>
        <li>Boosts creativity and problem-solving abilities.</li>
        <li>Provides a safe outlet for energy and expression.</li>
      </ul>
      <p class="mb-4">The initial response has been overwhelmingly positive, with children eagerly participating in the new activities. We are excited to expand this program to more communities, bringing joy and healthy development to countless children.</p>
      <p>Thank you for helping us bring the power of play to those who need it most.</p>
    `,
  },
  {
    id: "6",
    title: "Digital Inclusion: Bridging the Tech Gap",
    date: "June 15, 2024",
    author: "Adlai Heroes Team",
    image: "/placeholder.svg?height=400&width=800",
    content: `
      <p class="mb-4">In an increasingly digital world, access to technology and digital literacy is no longer a luxury but a necessity. Our new Digital Inclusion program aims to bridge the tech gap for underprivileged children.</p>
      <p class="mb-4">We are setting up computer labs in community centers and schools, providing children with hands-on experience with computers, internet basics, and even introductory coding. This initiative prepares them for future educational and career opportunities.</p>
      <h3 class="text-2xl font-bold text-gradient-primary mb-4 mt-6">What We Offer:</h3>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Computer literacy training.</li>
        <li>Internet safety workshops.</li>
        <li>Basic coding and programming skills.</li>
        <li>Access to online educational resources.</li>
      </ul>
      <p class="mb-4">The program has been met with immense enthusiasm, with children quickly grasping new concepts and showing a keen interest in technology. We believe this program will open up a world of possibilities for them.</p>
      <p>Your support helps us equip the next generation with the skills they need to thrive in the digital age.</p>
    `,
  },
  {
    id: "7",
    title: "Nutrition for Growth: Healthy Meals Initiative",
    date: "June 05, 2024",
    author: "Adlai Heroes Team",
    image: "/placeholder.svg?height=400&width=800",
    content: `
      <p class="mb-4">Good nutrition is fundamental to a child's growth, development, and ability to learn. Our 'Nutrition for Growth' initiative ensures that children in our programs receive healthy and balanced meals.</p>
      <p class="mb-4">Working with local partners, we provide nutritious food to schools and community centers, combating malnutrition and improving children's overall health. We also educate families on sustainable nutrition practices.</p>
      <h3 class="text-2xl font-bold text-gradient-primary mb-4 mt-6">Program Impact:</h3>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Reduced rates of malnutrition among beneficiaries.</li>
        <li>Improved concentration and academic performance.</li>
        <li>Enhanced physical development and immunity.</li>
        <li>Increased awareness of healthy eating habits.</li>
      </ul>
      <p class="mb-4">A well-nourished child is a healthy child, and a healthy child is better prepared to learn and succeed. This program is vital for the holistic development of the children we serve.</p>
      <p>Thank you for helping us feed hungry minds and bodies.</p>
    `,
  },
  {
    id: "8",
    title: "Success Stories: From Beneficiary to Leader",
    date: "May 28, 2024",
    author: "Adlai Heroes Team",
    image: "/placeholder.svg?height=400&width=800",
    content: `
      <p class="mb-4">We are incredibly proud to share the inspiring journey of [Beneficiary Name], who, after receiving support from Adlai Heroes Foundation's education program, has gone on to become a community leader.</p>
      <p class="mb-4">[Beneficiary Name]'s story is a testament to the transformative power of education and opportunity. From struggling to attend school, they are now [achievements, e.g., a university student, a local entrepreneur, a community advocate], actively giving back to their community.</p>
      <h3 class="text-2xl font-bold text-gradient-primary mb-4 mt-6">Key Takeaways:</h3>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Education provides a pathway out of poverty.</li>
        <li>Empowerment fosters leadership and community contribution.</li>
        <li>Long-term support creates lasting change.</li>
        <li>Every child has the potential to achieve greatness.</li>
      </ul>
      <p class="mb-4">Stories like [Beneficiary Name]'s motivate us every day. They remind us why our mission is so crucial and inspire us to continue our work with renewed dedication.</p>
      <p>We invite you to read more success stories on our website and see the profound impact your support creates.</p>
    `,
  },
]

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPost() {
      try {
        const blogPost = await supabaseApi.getBlogPost(params.slug)
        setPost(blogPost)
      } catch (error) {
        console.error('Error loading blog post:', error)
        setPost(null)
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [params.slug])

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mb-6 w-1/2"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <Button asChild variant="ghost" className="mb-8 text-primary hover:underline">
        <Link href="/blog">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>
      </Button>

      <Card variant="glass" className="p-8 shadow-lg">
        <Image
          src={post.featured_image || "/placeholder.svg"}
          alt={post.title}
          width={800}
          height={400}
          className="w-full h-auto max-h-[400px] object-cover rounded-lg mb-8"
        />
        <CardHeader className="p-0 mb-6">
          <CardTitle className="text-4xl md:text-5xl font-bold text-gradient-primary mb-2">{post.title}</CardTitle>
          <p className="text-gray-600 text-sm md:text-base">
            By {post.author} | {new Date(post.created_at).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </CardHeader>
        <CardContent className="p-0 text-lg text-gray-900 leading-relaxed blog-content">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </CardContent>
      </Card>
    </div>
  )
}
