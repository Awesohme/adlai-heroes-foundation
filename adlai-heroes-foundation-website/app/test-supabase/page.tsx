'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function TestSupabasePage() {
  const [connectionStatus, setConnectionStatus] = useState('Testing...')
  const [tables, setTables] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function testConnection() {
      try {
        // Test basic connection
        const { data, error } = await supabase
          .from('programs')
          .select('id, title, created_at')
          .limit(3)

        if (error) {
          const errorMsg = `Programs table error: ${error.message}`
          setError(errorMsg)
          setConnectionStatus('❌ Connection Error')
          toast.error('Supabase Connection Failed', {
            description: error.message,
            duration: 5000
          })
        } else {
          setConnectionStatus('✅ Connected Successfully')
          toast.success('Supabase Connected Successfully!', {
            description: `Found ${data.length} programs in database`,
            duration: 3000
          })
          
          // Test other tables
          const tableTests = [
            { name: 'blog_posts', query: supabase.from('blog_posts').select('id, title').limit(1) },
            { name: 'testimonials', query: supabase.from('testimonials').select('id, name').limit(1) },
            { name: 'board_members', query: supabase.from('board_members').select('id, name').limit(1) },
            { name: 'impact_stats', query: supabase.from('impact_stats').select('id, title').limit(1) }
          ]

          const results = await Promise.allSettled(
            tableTests.map(async (test) => {
              const { data, error } = await test.query
              return { 
                name: test.name, 
                status: error ? 'Error' : 'OK', 
                count: data?.length || 0,
                error: error?.message 
              }
            })
          )

          setTables(results.map((result, index) => 
            result.status === 'fulfilled' ? result.value : { 
              name: tableTests[index].name, 
              status: 'Failed', 
              error: 'Promise rejected' 
            }
          ))
        }
      } catch (err) {
        const errorMsg = `Connection failed: ${err}`
        setError(errorMsg)
        setConnectionStatus('❌ Connection Failed')
        toast.error('Critical Connection Error', {
          description: errorMsg,
          duration: 10000
        })
      }
    }

    testConnection()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">🔍 Supabase Connection Test</h1>
      
      {/* Connection Status */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
        <div className="text-lg font-medium mb-2">{connectionStatus}</div>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      {/* Environment Variables */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
        <div className="space-y-2 text-sm">
          <div>
            <strong>NEXT_PUBLIC_SUPABASE_URL:</strong> 
            <span className={process.env.NEXT_PUBLIC_SUPABASE_URL ? 'text-green-600' : 'text-red-600'}>
              {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
            </span>
          </div>
          <div>
            <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> 
            <span className={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'text-green-600' : 'text-red-600'}>
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}
            </span>
          </div>
          <div>
            <strong>URL Value:</strong> 
            <code className="bg-gray-100 px-2 py-1 rounded text-xs">
              {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}
            </code>
          </div>
        </div>
      </div>

      {/* Table Status */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Database Tables</h2>
        <div className="grid gap-4">
          {tables.map((table) => (
            <div key={table.name} className="border rounded p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">{table.name}</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  table.status === 'OK' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {table.status}
                </span>
              </div>
              {table.error && (
                <div className="text-red-600 text-sm mt-2">{table.error}</div>
              )}
              {table.count !== undefined && (
                <div className="text-gray-600 text-sm mt-1">Records: {table.count}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Direct SQL Test */}
      <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Direct Connection Test</h2>
        <button 
          onClick={async () => {
            try {
              toast.loading('Testing API connection...')
              const response = await fetch('/api/test-supabase')
              const result = await response.json()
              
              if (result.status === 'success') {
                toast.success('API Connection Successful!', {
                  description: `Programs found: ${result.connection.programs.count}`,
                  duration: 4000
                })
              } else {
                toast.error('API Connection Failed', {
                  description: result.error || 'Unknown error',
                  duration: 6000
                })
              }
              
              // Also show detailed results in console for debugging
              console.log('API Test Results:', result)
            } catch (err) {
              toast.error('API Test Failed', {
                description: `Network error: ${err}`,
                duration: 6000
              })
            }
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Test API Connection
        </button>
      </div>
    </div>
  )
}