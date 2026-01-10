import { prisma } from '../lib/prisma'

async function checkUser() {
  const user = await prisma.user.findUnique({
    where: { email: 'shisan@gmail.com' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      password: true,
    }
  })
  
  if (user) {
    console.log('User found:')
    console.log('ID:', user.id)
    console.log('Name:', user.name)
    console.log('Email:', user.email)
    console.log('Role:', user.role)
    console.log('Has password:', !!user.password)
    console.log('Password length:', user.password?.length)
  } else {
    console.log('User not found')
  }
  
  await prisma.$disconnect()
}

checkUser()
