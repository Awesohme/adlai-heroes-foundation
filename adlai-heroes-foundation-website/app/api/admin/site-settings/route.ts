import { NextRequest, NextResponse } from 'next/server'
import { supabaseApi } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    const settings = category 
      ? await supabaseApi.getSiteSettings(category)
      : await supabaseApi.getSiteSettings()
    
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch site settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const updates = await request.json()
    
    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { error: 'Request body must be an array of setting updates' },
        { status: 400 }
      )
    }
    
    await supabaseApi.updateSiteSettings(updates)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error updating site settings:', error)
    return NextResponse.json(
      { error: 'Failed to update site settings' },
      { status: 500 }
    )
  }
}