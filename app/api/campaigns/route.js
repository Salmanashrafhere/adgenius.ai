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

    // Optimization: Select only essential columns and minimize the join payload.
    // By only selecting 'id' from ad_creatives, we significantly reduce the response size.
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

    // Transform data to include adsCount while preserving the ad_creatives array structure.
    // This avoids breaking changes for components that expect the array (e.g., for .length)
    // while still providing the optimized adsCount for newer components.
    const optimizedCampaigns = campaigns.map(campaign => {
      return {
        ...campaign,
        adsCount: campaign.ad_creatives ? campaign.ad_creatives.length : 0
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
