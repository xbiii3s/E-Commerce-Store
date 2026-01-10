import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email')
  
  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }
  
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      password: true,
    }
  })
  
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  
  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    hasPassword: !!user.password,
    passwordLength: user.password?.length,
  })
}
