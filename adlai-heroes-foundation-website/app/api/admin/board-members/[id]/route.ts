import { NextRequest, NextResponse } from 'next/server'
import { supabaseApi } from '@/lib/supabase'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const data = await request.json()
    const boardMember = await supabaseApi.updateBoardMember(id, data)
    return NextResponse.json(boardMember)
  } catch (error) {
    console.error('Error updating board member:', error)
    return NextResponse.json(
      { error: 'Failed to update board member' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    await supabaseApi.deleteBoardMember(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting board member:', error)
    return NextResponse.json(
      { error: 'Failed to delete board member' },
      { status: 500 }
    )
  }
}