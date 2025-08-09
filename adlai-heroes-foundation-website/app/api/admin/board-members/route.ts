import { NextRequest, NextResponse } from 'next/server'
import { supabaseApi } from '@/lib/supabase'

export async function GET() {
  try {
    const boardMembers = await supabaseApi.getBoardMembers()
    return NextResponse.json(boardMembers)
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
    const boardMember = await supabaseApi.createBoardMember(data)
    return NextResponse.json(boardMember, { status: 201 })
  } catch (error) {
    console.error('Error creating board member:', error)
    return NextResponse.json(
      { error: 'Failed to create board member' },
      { status: 500 }
    )
  }
}