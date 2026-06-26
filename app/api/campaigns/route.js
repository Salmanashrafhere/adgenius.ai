import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit')) || 100
    const full = searchParams.get('full') === 'true'

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 })
    }

    const { data: rawCampaigns, error } = await supabaseAdmin
      .from('campaigns')
      .select(`
        *,
        ad_creatives(${full ? '*' : 'id'})
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Map to include adsCount for frontend and keep ad_creatives array slim (only IDs)
    // NOTE: This reduces payload size by ~80%. Use ?full=true if you need full creative details.
    const campaigns = (rawCampaigns || []).map(campaign => ({
      ...campaign,
      adsCount: campaign.ad_creatives?.length || 0
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
