import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secure-secret-key-change-this-in-production'

async function verifyAuth(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value
  
  if (!token) {
    throw new Error('No authentication token')
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch (error) {
    throw new Error('Invalid token')
  }
}

// GET - List all admin users
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const currentUser = await verifyAuth(request)
    
    // Check if user has permission to manage users
    if (currentUser.role !== 'super_admin' && !currentUser.permissions.includes('user_management')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const { data: users, error } = await supabase
      .from('admin_users')
      .select('id, email, role, permissions, is_active, created_at, updated_at')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// POST - Create new admin user
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const currentUser = await verifyAuth(request)
    
    // Check if user has permission to manage users
    if (currentUser.role !== 'super_admin' && !currentUser.permissions.includes('user_management')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const { email, password, role, permissions } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Insert new user
    const { data: newUser, error } = await supabase
      .from('admin_users')
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        role,
        permissions: permissions || [],
        is_active: true
      })
      .select('id, email, role, permissions, is_active, created_at, updated_at')
      .single()

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        )
      }
      throw new Error(error.message)
    }

    return NextResponse.json({ 
      message: 'User created successfully',
      user: newUser
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create user' },
      { status: 500 }
    )
  }
}