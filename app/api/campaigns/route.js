import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const limit = searchParams.get('limit')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 })
    }

    let query = supabaseAdmin
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

    if (limit) {
      const limitVal = parseInt(limit, 10);
      if (!isNaN(limitVal) && limitVal > 0) {
        query = query.limit(limitVal);
      }
    }

    const { data: campaigns, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Optimize payload by mapping to adsCount and removing full ad_creatives objects
    const optimizedCampaigns = campaigns.map(campaign => {
      const { ad_creatives, ...rest } = campaign
      return {
        ...rest,
        adsCount: ad_creatives?.length || 0
      }
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
