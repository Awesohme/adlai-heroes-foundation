import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('board_members')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching board members:', error)
    return NextResponse.json(
      { error: 'Failed to fetch board members' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const { data: result, error } = await supabaseAdmin
      .from('board_members')
      .insert([data])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating board member:', error)
    return NextResponse.json(
      { error: 'Failed to create board member' },
      { status: 500 }
    )
  }
}