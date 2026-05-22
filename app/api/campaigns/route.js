import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'

export async function GET() {
  try {
    let supabase;
    try {
      supabase = await createClient()
    } catch (e) {
      console.error('Supabase client error:', e)
      return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 })
    }

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
      .eq('user_id', user.id)
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
