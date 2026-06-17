import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'

export async function GET(req) {
  try {
    const supabase = await createClient()

    // Get authenticated user session
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select(`
        *,
        ad_creatives(*)
      `)
      .eq('user_id', user.id) // Filter by authenticated user ID (Fixes IDOR)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      campaigns
    })
  } catch (error) {
    console.error('Fetch campaigns error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
