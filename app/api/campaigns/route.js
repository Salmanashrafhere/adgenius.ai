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

    const { data: campaigns, error } = await supabaseAdmin
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

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Map to include adsCount while keeping ad_creatives for backward compatibility
    // but with minimized data (just IDs).
    // Bolt: Reducing payload size improves TBT and LCP for the campaign list view.
    // We keep ad_creatives to avoid breaking changes, but only with IDs.
    const optimizedCampaigns = campaigns.map(c => {
      return {
        ...c,
        adsCount: c.ad_creatives?.length || 0
      };
    });

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
