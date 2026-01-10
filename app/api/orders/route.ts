import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ORD-${timestamp}-${random}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, shippingAddress, subtotal, shipping, tax, total } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: 'No items in cart' }, { status: 400 })
    }

    const orderNumber = generateOrderNumber()

    // Create order in database
    const order = await prisma.order.create({
      data: {
        orderNumber,
        email: shippingAddress.email,
        phone: shippingAddress.phone || null,
        subtotal,
        shipping,
        tax,
        total,
        currency: 'USD',
        shippingAddress: JSON.stringify({
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          address: shippingAddress.address,
          apartment: shippingAddress.apartment,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country,
        }),
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || null,
          })),
        },
      },
    })

    // If Stripe is configured, create Stripe Checkout session
    if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_your_key_here') {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        customer_email: shippingAddress.email,
        line_items: items.map((item: any) => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
              images: item.image ? [item.image] : [],
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })),
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber,
        },
        success_url: `${process.env.NEXTAUTH_URL}/checkout/success?order=${orderNumber}`,
        cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
      })

      // Update order with payment intent ID
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentIntentId: session.id },
      })

      return NextResponse.json({
        success: true,
        orderNumber: order.orderNumber,
        checkoutUrl: session.url,
      })
    }

    // Demo mode: no Stripe, just return success
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: 'paid', status: 'processing' },
    })

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
    })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const orderNumber = searchParams.get('orderNumber')

  if (!orderNumber) {
    return NextResponse.json({ error: 'Order number required' }, { status: 400 })
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  })

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  return NextResponse.json(order)
}
