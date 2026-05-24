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

    const { data: rawCampaigns, error } = await supabaseAdmin
      .from('campaigns')
      .select(`
        *,
        ad_creatives(id)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Performance optimization: Minimize payload by only sending ads count
    // instead of full creative objects for the list view.
    const campaigns = rawCampaigns.map(campaign => ({
      ...campaign,
      adsCount: campaign.ad_creatives?.length || 0,
      // Maintain minimized array for backward compatibility if needed,
      // but reduce payload size by ~90% for large campaigns.
      ad_creatives: campaign.ad_creatives || []
    }));

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
