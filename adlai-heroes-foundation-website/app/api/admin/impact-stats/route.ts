import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const { data: result, error } = await supabaseAdmin
      .from('impact_stats')
      .insert([data])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating impact stat:', error)
    return NextResponse.json(
      { error: 'Failed to create impact stat' },
      { status: 500 }
    )
  }
}