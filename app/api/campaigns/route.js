import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam, 10) : null

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 })
    }

    // 1. Fetch limited campaigns with minimal ad creative data (just IDs for counting)
    // We use { count: 'exact' } to get the total number of campaigns regardless of limit
    const { data: campaigns, error, count: totalCount } = await supabaseAdmin
      .from('campaigns')
      .select(`
        *,
        ad_creatives(id)
      `, { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit || 1000)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // 2. Fetch total ads count for all user's campaigns
    // Fetch campaign IDs for this user
    const { data: userCampaignIds } = await supabaseAdmin
      .from('campaigns')
      .select('id')
      .eq('user_id', userId)

    const ids = userCampaignIds?.map(c => c.id) || []

    let totalAdsCount = 0
    // To handle scalability, we perform the count in a single efficient query if IDs exist
    if (ids.length > 0) {
      const { count, error: countError } = await supabaseAdmin
        .from('ad_creatives')
        .select('id', { count: 'exact', head: true })
        .in('campaign_id', ids)

      if (!countError) {
        totalAdsCount = count || 0
      }
    }

    // 3. Map campaigns to include a flat adsCount property
    const optimizedCampaigns = (campaigns || []).map(c => {
      const { ad_creatives, ...rest } = c
      return {
        ...rest,
        adsCount: ad_creatives?.length || 0
      }
    })

    return NextResponse.json({
      success: true,
      campaigns: optimizedCampaigns,
      totalCount: totalCount ?? 0,
      totalAdsCount: totalAdsCount ?? 0
    })
  } catch (error) {
    console.error('Fetch campaigns error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
