import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const full = searchParams.get('full') !== 'false'
    const limit = parseInt(searchParams.get('limit') || '100')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 })
    }

    const selectQuery = full
      ? '*, ad_creatives(*)'
      : 'id, name, status, platform, product_url, created_at, ad_creatives(id)'

    const { data: rawCampaigns, error } = await supabaseAdmin
      .from('campaigns')
      .select(selectQuery)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Add adsCount to the response to reduce client-side processing
    const campaigns = rawCampaigns.map(c => ({
      ...c,
      adsCount: c.ad_creatives?.length || 0,
      // If not full mode, we can remove the ad_creatives array after getting count
      ...(full ? {} : { ad_creatives: undefined })
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
