import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test environment variables
    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    }

    // Test basic connection
    const { data: programs, error: programsError } = await supabase
      .from('programs')
      .select('id, title, slug, published')
      .limit(3)

    // Test table structure
    const { data: tableInfo, error: tableError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'programs')
      .eq('table_schema', 'public')

    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      environment: envCheck,
      connection: {
        programs: {
          success: !programsError,
          error: programsError?.message,
          data: programs,
          count: programs?.length || 0
        },
        tableStructure: {
          success: !tableError,
          error: tableError?.message,
          columns: tableInfo?.map(col => `${col.column_name} (${col.data_type})`).sort()
        }
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}