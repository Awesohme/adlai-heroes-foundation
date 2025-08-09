import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const data = await request.json()

    const { data: result, error } = await supabaseAdmin
      .from('impact_timeline')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()

    if (error) throw error
    if (!result || result.length === 0) {
      return NextResponse.json({ error: `Impact timeline item with id ${id} not found` }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error updating impact timeline:', error)
    return NextResponse.json({ error: 'Failed to update impact timeline' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const { error } = await supabaseAdmin
      .from('impact_timeline')
      .delete()
      .eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting impact timeline:', error)
    return NextResponse.json({ error: 'Failed to delete impact timeline' }, { status: 500 })
  }
}

