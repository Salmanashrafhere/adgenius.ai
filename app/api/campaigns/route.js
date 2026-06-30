import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const full = searchParams.get('full') !== 'false'
    const limit = parseInt(searchParams.get('limit')) || 100

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 })
    }

    // Optimization: If full=false, we only select necessary fields and count ad_creatives
    // instead of fetching all ad_creative data.
    const selectStr = full
      ? '*, ad_creatives(*)'
      : 'id, name, status, platform, created_at, ad_creatives(id)'

    let { data: campaigns, error } = await supabaseAdmin
      .from('campaigns')
      .select(selectStr)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // If not full mode, transform ad_creatives array to a simple adsCount
    if (!full && campaigns) {
      campaigns = campaigns.map(c => {
        const { ad_creatives, ...rest } = c;
        return {
          ...rest,
          adsCount: ad_creatives ? ad_creatives.length : 0
        };
      });
    } else if (full && campaigns) {
      // Even in full mode, let's provide adsCount for convenience
      campaigns = campaigns.map(c => ({
        ...c,
        adsCount: c.ad_creatives ? c.ad_creatives.length : 0
      }));
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
