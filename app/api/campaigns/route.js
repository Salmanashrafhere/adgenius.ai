import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const full = searchParams.get('full') !== 'false'
    const limit = parseInt(searchParams.get('limit')) || 100

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 })
    }

    // Optimization: Run count queries in parallel for total stats
    // Note: We use .select('*', { count: 'exact', head: true }) for efficient counting
    const [totalCountRes, totalAdsCountRes] = await Promise.all([
      supabaseAdmin
        .from('campaigns')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId),
      supabaseAdmin
        .from('ad_creatives')
        .select('id, campaigns!inner(user_id)', { count: 'exact', head: true })
        .eq('campaigns.user_id', userId)
    ]).catch(err => {
      console.error('Parallel count query error:', err);
      return [{ count: 0 }, { count: 0 }];
    });

    const selectFields = full
      ? '*, ad_creatives(*)'
      : 'id, name, status, platform, created_at, ad_creatives(id)'

    const { data: rawCampaigns, error } = await supabaseAdmin
      .from('campaigns')
      .select(selectFields)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Add adsCount to each campaign and preserve light structure
    const campaigns = rawCampaigns.map(c => ({
      ...c,
      adsCount: c.ad_creatives?.length || 0
    }))

    return NextResponse.json({
      success: true,
      campaigns,
      totalCount: totalCountRes.count || 0,
      totalAdsCount: totalAdsCountRes.count || 0
    })
  } catch (error) {
    console.error('Fetch campaigns error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
