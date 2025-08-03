import { NextRequest, NextResponse } from 'next/server'
import { supabaseApi } from '@/lib/supabase'

export async function GET() {
  try {
    const teamMembers = await supabaseApi.getTeamMembers()
    return NextResponse.json(teamMembers)
  } catch (error) {
    console.error('Error fetching team members:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const teamMember = await supabaseApi.createTeamMember(data)
    return NextResponse.json(teamMember, { status: 201 })
  } catch (error) {
    console.error('Error creating team member:', error)
    return NextResponse.json(
      { error: 'Failed to create team member' },
      { status: 500 }
    )
  }
}