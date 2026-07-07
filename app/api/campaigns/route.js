import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam) : 1000
    const full = searchParams.get('full') !== 'false'

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 })
    }

    // Step 1: Fetch total count
    const { count: totalCount, error: countError } = await supabaseAdmin
      .from('campaigns')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (countError) {
      console.error('Error fetching total count:', countError)
      return NextResponse.json({ error: countError.message }, { status: 500 })
    }

    // Step 2: Fetch total ads count using a single query with inner join filter
    // This is much more efficient than fetching all IDs and using .in()
    const { count: totalAdsCount, error: adsCountError } = await supabaseAdmin
      .from('ad_creatives')
      .select('*, campaigns!inner(user_id)', { count: 'exact', head: true })
      .eq('campaigns.user_id', userId)

    // Step 3: Fetch the actual campaigns
    const selectFields = full ? '*, ad_creatives(*)' : '*, ad_creatives(id)'
    const { data: campaigns, error: fetchError } = await supabaseAdmin
      .from('campaigns')
      .select(selectFields)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (fetchError) {
      console.error('Error fetching campaigns:', fetchError)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    const formattedCampaigns = campaigns.map(c => {
      if (!full) {
        const { ad_creatives, ...rest } = c
        return {
          ...rest,
          adsCount: ad_creatives?.length || 0
        }
      }
      return c
    })

    return NextResponse.json({
      success: true,
      campaigns: formattedCampaigns,
      totalCount: totalCount || 0,
      totalAdsCount
    })
  } catch (error) {
    console.error('Fetch campaigns error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
