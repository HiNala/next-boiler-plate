import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Simple query to test connection using version()
    const { data, error } = await supabase
      .rpc('version')

    if (error) {
      console.error('Database query error:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: 'Error querying database'
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully connected to database',
      data 
    })

  } catch (error) {
    console.error('Connection error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Error connecting to database'
    }, { status: 500 })
  }
} 