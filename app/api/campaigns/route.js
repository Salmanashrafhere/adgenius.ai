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

    // Optimized selection for list views: only select fields needed by Dashboard and My Campaigns
    // Slim down ad_creatives to only IDs to drastically reduce payload size
    const { data: rawCampaigns, error } = await supabaseAdmin
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

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Map the response to include adsCount for frontend convenience while maintaining ad_creatives[] for backward compatibility
    const campaigns = (rawCampaigns || []).map(campaign => ({
      ...campaign,
      adsCount: campaign.ad_creatives?.length || 0
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
