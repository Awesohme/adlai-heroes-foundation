import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { data: result, error } = await supabaseAdmin
      .from('impact_timeline')
      .insert([{ ...data, updated_at: new Date().toISOString() }])
      .select()
      .single()
    if (error) throw error
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating impact timeline:', error)
    return NextResponse.json({ error: 'Failed to create impact timeline' }, { status: 500 })
  }
}

