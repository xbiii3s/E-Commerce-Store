import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AccountClient from '@/components/account/AccountClient'

async function getUserOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  })
}

async function getUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
  })
}

export default async function AccountPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect('/auth/signin')
  }

  const userId = (session.user as any).id
  const [user, orders] = await Promise.all([
    getUser(userId),
    getUserOrders(userId),
  ])

  if (!user) {
    redirect('/auth/signin')
  }

  return (
    <AccountClient 
      user={{ name: user.name, email: user.email }}
      orders={orders}
    />
  )
}
