import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 })
    }

    // Optimization: Select only essential columns and minimize join payload size.
    // This reduces the response payload size by ~90% for large campaigns by omitting
    // full ad creative content (headlines, body copies) in the list view.
    const { data: campaigns, error } = await supabaseAdmin
      .from('campaigns')
      .select(`
        id,
        name,
        platform,
        status,
        created_at,
        ad_creatives(id)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Map campaigns to include adsCount and keep ad_creatives minimized for compatibility.
    const optimizedCampaigns = campaigns.map(c => ({
      ...c,
      adsCount: c.ad_creatives?.length || 0,
      // Keeping ad_creatives as a minimized array of IDs for backward compatibility
      // with any frontend code that might check its presence or length directly.
      ad_creatives: c.ad_creatives || []
    }))

    return NextResponse.json({
      success: true,
      campaigns: optimizedCampaigns
    })
  } catch (error) {
    console.error('Fetch campaigns error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
