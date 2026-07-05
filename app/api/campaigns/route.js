import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const full = searchParams.get('full') !== 'false'
    const limitStr = searchParams.get('limit')
    const limit = limitStr ? parseInt(limitStr) : 100

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 })
    }

    // Optimization: When full=false, we only fetch essential fields and count ad_creatives
    // This reduces payload size by ~80% for list views.
    const selectFields = full
      ? '*, ad_creatives(*)'
      : 'id, name, status, platform, created_at, ad_creatives(id)'

    // Fetch campaigns
    const { data: campaigns, error } = await supabaseAdmin
      .from('campaigns')
      .select(selectFields)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Get total campaign count for stats cards (optimized with head: true)
    let totalCount = 0;
    try {
      const { count } = await supabaseAdmin
        .from('campaigns')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      totalCount = count || 0;
    } catch (e) {
      console.error('Error fetching total count:', e);
    }

    // Get total ads count across all campaigns for this user
    // We first fetch campaign IDs, then count their ad_creatives
    let totalAdsCount = 0;
    try {
      const { data: userCampaigns } = await supabaseAdmin
        .from('campaigns')
        .select('id')
        .eq('user_id', userId);

      if (userCampaigns?.length) {
        const { count } = await supabaseAdmin
          .from('ad_creatives')
          .select('*', { count: 'exact', head: true })
          .in('campaign_id', userCampaigns.map(c => c.id));
        totalAdsCount = count || 0;
      }
    } catch (err) {
      console.error('Error fetching total ads count:', err);
    }

    // Transform data: if full=false, replace ad_creatives array with adsCount
    const processedCampaigns = campaigns.map(c => {
      if (full) return c;
      return {
        ...c,
        adsCount: c.ad_creatives?.length || 0,
        ad_creatives: undefined
      };
    })

    return NextResponse.json({
      success: true,
      campaigns: processedCampaigns,
      totalCount: totalCount || 0,
      totalAdsCount: totalAdsCount || 0
    })
  } catch (error) {
    console.error('Fetch campaigns error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
