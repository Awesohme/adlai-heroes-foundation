import { NextRequest, NextResponse } from 'next/server'
import { supabaseApi } from '@/lib/supabase'
import type { Author } from '@/lib/supabase'

export async function GET() {
  try {
    const authors = await supabaseApi.getAuthors()
    return NextResponse.json(authors)
  } catch (error) {
    console.error('Error fetching authors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch authors' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const author = await supabaseApi.createAuthor(body as Omit<Author, 'id' | 'created_at' | 'updated_at'>)
    return NextResponse.json(author)
  } catch (error) {
    console.error('Error creating author:', error)
    return NextResponse.json(
      { error: 'Failed to create author' },
      { status: 500 }
    )
  }
}