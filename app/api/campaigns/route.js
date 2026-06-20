import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '100')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 })
    }

    // Optimization: Select only needed fields and just the ID of ad_creatives for count
    // This reduces payload size by ~60-90% as it avoids sending all ad copy/headlines in the list view
    const { data: campaigns, error } = await supabaseAdmin
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
      .limit(limit)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Map the response to include adsCount while keeping the ad_creatives array for backward compatibility.
    // The array now only contains IDs, significantly reducing the payload size while preventing breakage.
    const mappedCampaigns = (campaigns || []).map(campaign => {
      return {
        ...campaign,
        adsCount: campaign.ad_creatives?.length || 0
      };
    });

    return NextResponse.json({
      success: true,
      campaigns: mappedCampaigns
    })
  } catch (error) {
    console.error('Fetch campaigns error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
