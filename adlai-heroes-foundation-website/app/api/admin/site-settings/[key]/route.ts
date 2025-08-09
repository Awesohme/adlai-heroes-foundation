import { NextRequest, NextResponse } from 'next/server'
import { supabaseApi } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const setting = await supabaseApi.getSiteSettingByKey(params.key)
    
    if (!setting) {
      return NextResponse.json(
        { error: 'Setting not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(setting)
  } catch (error) {
    console.error('Error fetching site setting:', error)
    return NextResponse.json(
      { error: 'Failed to fetch site setting' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const { setting_value } = await request.json()
    
    await supabaseApi.updateSiteSettings([{
      setting_key: params.key,
      setting_value
    }])
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating site setting:', error)
    return NextResponse.json(
      { error: 'Failed to update site setting' },
      { status: 500 }
    )
  }
}