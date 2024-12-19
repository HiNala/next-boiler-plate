import { createClient } from '@/lib/supabase/server'
import { DatabaseError, createRouteHandler } from '@/lib/errors'

export const GET = createRouteHandler(async () => {
  const supabase = await createClient()
  const { data, error } = await supabase.from('test').select('*')
  
  if (error) {
    throw new DatabaseError('Failed to fetch test data', error.code)
  }
  
  return { data }
}) 