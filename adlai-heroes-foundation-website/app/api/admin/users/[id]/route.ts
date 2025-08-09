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

// PUT - Update admin user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const userId = parseInt(params.id)
    const { email, password, role, permissions } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData: any = {
      email: email.toLowerCase(),
      role,
      permissions: permissions || [],
      updated_at: new Date().toISOString()
    }

    // Only update password if provided
    if (password && password.trim() !== '') {
      updateData.password_hash = await bcrypt.hash(password, 12)
    }

    // Update user
    const { data: updatedUser, error } = await supabase
      .from('admin_users')
      .update(updateData)
      .eq('id', userId)
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
      message: 'User updated successfully',
      user: updatedUser
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update user' },
      { status: 500 }
    )
  }
}

// DELETE - Delete admin user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const userId = parseInt(params.id)

    // Prevent self-deletion
    if (currentUser.userId === userId) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      )
    }

    // Delete user
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', userId)

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({ 
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete user' },
      { status: 500 }
    )
  }
}