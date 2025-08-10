import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET && process.env.NODE_ENV !== 'development') {
  console.warn('JWT_SECRET environment variable is required for production security')
}

export async function GET(request: NextRequest) {
  try {
    if (!JWT_SECRET) {
      return NextResponse.json(
        { error: 'JWT_SECRET environment variable is required for authentication' },
        { status: 500 }
      )
    }

    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token' },
        { status: 401 }
      )
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any

    return NextResponse.json({
      user: {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        permissions: decoded.permissions
      }
    })
  } catch (error) {
    console.error('Auth verification error:', error)
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    )
  }
}