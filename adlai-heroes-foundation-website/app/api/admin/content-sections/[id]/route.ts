import { NextRequest, NextResponse } from 'next/server'
import { supabaseApi } from '@/lib/supabase'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const data = await request.json()
    const contentSection = await supabaseApi.updateContentSection(id, data)
    return NextResponse.json(contentSection)
  } catch (error) {
    console.error('Error updating content section:', error)
    return NextResponse.json(
      { error: 'Failed to update content section' },
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
    await supabaseApi.deleteContentSection(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting content section:', error)
    return NextResponse.json(
      { error: 'Failed to delete content section' },
      { status: 500 }
    )
  }
}