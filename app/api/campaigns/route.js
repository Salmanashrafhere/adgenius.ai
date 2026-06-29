import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const full = searchParams.get('full') !== 'false' // Default to true
    const limit = parseInt(searchParams.get('limit')) || 100

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 })
    }

    let query;
    if (full) {
      query = supabaseAdmin
        .from('campaigns')
        .select(`
          *,
          ad_creatives(*)
        `)
    } else {
      // Optimized query for list views
      query = supabaseAdmin
        .from('campaigns')
        .select(`
          id,
          name,
          status,
          platform,
          created_at,
          ad_creatives(id)
        `)
    }

    query = query
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    let { data: campaigns, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Add adsCount to results if not full fetch
    if (!full && campaigns) {
      campaigns = campaigns.map(c => ({
        ...c,
        adsCount: c.ad_creatives?.length || 0,
        // Keep only IDs to save bandwidth if needed, or just remove it
        ad_creatives: c.ad_creatives?.map(a => a.id) || []
      }))
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
