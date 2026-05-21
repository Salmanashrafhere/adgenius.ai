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

    const { data: rawCampaigns, error } = await supabaseAdmin
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

    // Optimize payload by calculating count on server and removing full relations
    const campaigns = rawCampaigns.map(c => ({
      id: c.id,
      name: c.name,
      platform: c.platform,
      status: c.status,
      created_at: c.created_at,
      adsCount: c.ad_creatives?.length || 0,
      // Use the existing ad_creatives array but with minimized objects (only IDs)
      // to avoid breaking changes while still reducing payload significantly
      ad_creatives: c.ad_creatives || []
    }))

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
