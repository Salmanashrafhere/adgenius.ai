import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const full = searchParams.get('full') !== 'false' // default to true
    const limit = parseInt(searchParams.get('limit')) || 100

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 })
    }

    let query = supabaseAdmin
      .from('campaigns')
      .select(full ? `
        *,
        ad_creatives(*)
      ` : `
        id, name, status, platform, created_at,
        ad_creatives(id)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    const { data: rawCampaigns, error } = await query

    const campaigns = rawCampaigns?.map(c => ({
      ...c,
      adsCount: c.ad_creatives?.length || 0,
      // If not full, we don't want to return the actual ad_creatives array if it's just IDs
      ad_creatives: full ? c.ad_creatives : undefined
    }))

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

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
