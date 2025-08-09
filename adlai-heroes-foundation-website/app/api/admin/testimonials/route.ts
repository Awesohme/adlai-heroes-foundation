import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { data: result, error } = await supabaseAdmin
      .from('testimonials')
      .insert([data])
      .select()
      .single()
    if (error) throw error
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 })
  }
}

