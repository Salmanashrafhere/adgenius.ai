import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'

export async function POST(req) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    let supabase;
    try {
      supabase = await createClient()
    } catch (e) {
      console.error('Supabase client error:', e)
      return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 })
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      session: data.session,
      user: data.user
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
