import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Simple raw SQL query that doesn't require any tables
    const { data, error } = await supabase
      .from('_dummy_query')
      .select('*')
      .limit(1)
      .maybeSingle()

    // If we get a "relation does not exist" error, that's actually good!
    // It means we can connect to the database, even though the table doesn't exist
    if (error && error.code === '42P01') {
      return NextResponse.json({ 
        success: true, 
        message: 'Successfully connected to database (table does not exist, but connection works)',
      })
    }

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