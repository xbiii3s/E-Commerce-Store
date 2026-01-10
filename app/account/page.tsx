import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AccountClient from '@/components/account/AccountClient'

async function getUserWithOrders(email: string) {
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
