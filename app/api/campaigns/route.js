import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const limitParam = searchParams.get('limit')
    const limit = limitParam !== null ? parseInt(limitParam) : null
    // Bolt Optimization: Default to full=true to avoid breaking existing clients,
    // but allow clients to opt-in to a minimal payload for better performance.
    const full = searchParams.get('full') !== 'false'

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 })
    }

    // Bolt Optimization: Select only necessary fields for list views to reduce database and network overhead.
    const selectFields = full
      ? '*, ad_creatives(*)'
      : 'id, name, status, platform, goal, tone, created_at, user_id, ad_creatives(id)'

    let query = supabaseAdmin
      .from('campaigns')
      .select(selectFields)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (limit !== null && !isNaN(limit) && limit > 0) {
      query = query.limit(limit)
    }

    const { data: campaigns, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Bolt Optimization: Map results to include adsCount and clean up the joined id array
    const optimizedCampaigns = campaigns.map(c => {
      const adsCount = c.ad_creatives?.length || 0

      if (!full) {
        // If not a full request, we replace the ad_creatives array of IDs with just the count
        // to minimize the JSON payload size significantly.
        const { ad_creatives, ...rest } = c
        return { ...rest, adsCount }
      }

      return { ...c, adsCount }
    })

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
