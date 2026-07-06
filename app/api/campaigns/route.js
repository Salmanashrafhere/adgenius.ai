import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    // Default full to true for backward compatibility
    const full = searchParams.get('full') !== 'false'
    const limitParam = searchParams.get('limit')
    // Default limit to 1000 for campaigns list to avoid missing data,
    // but allow dashboard to set a smaller limit like 10.
    const limit = limitParam ? parseInt(limitParam) : 1000

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 })
    }

    // Select only needed fields if not full to reduce payload size
    // We include ad_creatives(id) to get the count without fetching all data
    const selectFields = full
      ? `*, ad_creatives(*)`
      : `id, name, status, platform, created_at, ad_creatives(id)`

    const { data: campaigns, error } = await supabaseAdmin
      .from('campaigns')
      .select(selectFields)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Transform to include adsCount and remove ad_creatives if full=false
    const processedCampaigns = campaigns.map(c => {
      const adsCount = c.ad_creatives ? c.ad_creatives.length : 0
      const campaign = { ...c, adsCount }
      if (!full) {
        delete campaign.ad_creatives
      }
      return campaign
    })

    // Fetch aggregate statistics for dashboard
    // Use head: true for efficient count queries
    const [totalCountRes, campaignIdsRes] = await Promise.all([
      supabaseAdmin
        .from('campaigns')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId),
      supabaseAdmin
        .from('campaigns')
        .select('id')
        .eq('user_id', userId)
    ])

    const totalCount = totalCountRes.count || 0
    const ids = campaignIdsRes.data?.map(c => c.id) || []

    let totalAdsCount = 0
    if (ids.length > 0) {
      // For large sets of IDs, we should ideally use a join or a more efficient way,
      // but given Supabase client limitations and current scale, we use .in().
      // We optimize by only doing this if there are IDs and using head: true.
      const { count } = await supabaseAdmin
        .from('ad_creatives')
        .select('*', { count: 'exact', head: true })
        .in('campaign_id', ids)
      totalAdsCount = count || 0
    }

    return NextResponse.json({
      success: true,
      campaigns: processedCampaigns,
      totalCount,
      totalAdsCount
    })
  } catch (error) {
    console.error('Fetch campaigns error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
