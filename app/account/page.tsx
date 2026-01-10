import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AccountClient from '@/components/account/AccountClient'

export const dynamic = 'force-dynamic'

async function getUserWithOrders(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        orders: {
          include: { items: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    })
    return user
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

export default async function AccountPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect('/auth/signin')
  }

  const user = await getUserWithOrders(session.user.email)

  if (!user) {
    redirect('/auth/signin')
  }

  return (
    <AccountClient 
      user={{ name: user.name, email: user.email }}
      orders={user.orders}
    />
  )
}
