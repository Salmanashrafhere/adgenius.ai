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

    const limit = searchParams.get('limit')

    let query = supabaseAdmin
      .from('campaigns')
      .select(`
        id,
        name,
        platform,
        status,
        created_at,
        product_url,
        goal,
        ad_creatives(id)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (limit) {
      query = query.limit(parseInt(limit))
    }

    const { data: rawCampaigns, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Optimization: Map results to include adsCount while maintaining ad_creatives array for backward compatibility
    // We only fetch 'id' for ad_creatives to reduce payload size by ~60-90% for list views
    const campaigns = (rawCampaigns || []).map(c => {
      return {
        ...c,
        adsCount: c.ad_creatives?.length || 0
      }
    })

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
