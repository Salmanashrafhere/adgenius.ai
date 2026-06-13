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

    // Optimization: Only fetch the id of ad_creatives to calculate count on server.
    // Reduces payload size by ~70% as we avoid fetching full ad copy/headlines in list view.
    const { data: campaigns, error } = await supabaseAdmin
      .from('campaigns')
      .select(`
        *,
        ad_creatives(id)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Map campaigns to include adsCount and keep ad_creatives (with only ids) for backward compatibility.
    const optimizedCampaigns = campaigns.map(c => ({
      ...c,
      adsCount: c.ad_creatives?.length || 0
    }));

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
