import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const full = searchParams.get('full') !== 'false' // Default to true for backward compatibility
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam, 10) : 100

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 })
    }

    // Optimization: If full=false, we only fetch what's needed for list views
    // and use server-side counting for ads to reduce payload size.
    let query = supabaseAdmin
      .from('campaigns')
      .select(full ? `
        *,
        ad_creatives(*)
      ` : `
        id,
        name,
        status,
        platform,
        created_at,
        ad_creatives(id)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (limit && !isNaN(limit)) {
      query = query.limit(limit)
    }

    const { data: campaigns, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Calculate aggregate stats for the user
    // Optimization: Use count: 'exact', head: true to avoid fetching data
    const { count: totalCount } = await supabaseAdmin
      .from('campaigns')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    const { count: totalAdsCount } = await supabaseAdmin
      .from('ad_creatives')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    // Process campaigns to include adsCount
    const processedCampaigns = campaigns.map(c => {
      const adsCount = c.ad_creatives?.length || 0
      if (!full) {
        // Remove the ad_creatives array to minimize payload if not full
        const { ad_creatives, ...rest } = c
        return { ...rest, adsCount }
      }
      return { ...c, adsCount }
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
