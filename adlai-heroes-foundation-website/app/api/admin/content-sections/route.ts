import { NextRequest, NextResponse } from 'next/server'
import { supabaseApi } from '@/lib/supabase'

export async function GET() {
  try {
    const contentSections = await supabaseApi.getContentSections()
    return NextResponse.json(contentSections)
  } catch (error) {
    console.error('Error fetching content sections:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content sections' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const contentSection = await supabaseApi.createContentSection(data)
    return NextResponse.json(contentSection, { status: 201 })
  } catch (error) {
    console.error('Error creating content section:', error)
    return NextResponse.json(
      { error: 'Failed to create content section' },
      { status: 500 }
    )
  }
}