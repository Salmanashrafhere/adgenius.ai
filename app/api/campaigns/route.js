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

    const isFull = searchParams.get('full') !== 'false';
    const limit = parseInt(searchParams.get('limit')) || 100;

    const { data, error } = await supabaseAdmin
      .from('campaigns')
      .select(isFull ? `
        *,
        ad_creatives(*)
      ` : `
        id,
        name,
        status,
        platform,
        created_at,
        ad_creatives(id)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const totalCount = data.length;
    const totalAdsCount = data.reduce((sum, c) => sum + (c.ad_creatives?.length || 0), 0);

    // Apply limit after calculating totals to ensure stats are accurate
    const limitedData = data.slice(0, limit);

    // Add adsCount and conditionally remove ad_creatives to optimize payload size
    const campaigns = limitedData.map(c => {
      const adsCount = c.ad_creatives?.length || 0;
      const optimized = { ...c, adsCount };
      if (!isFull) {
        // In non-full mode, we only needed ad_creatives for the count
        delete optimized.ad_creatives;
      }
      return optimized;
    });

    return NextResponse.json({
      success: true,
      campaigns,
      totalCount,
      totalAdsCount
    })
  } catch (error) {
    console.error('Fetch campaigns error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
