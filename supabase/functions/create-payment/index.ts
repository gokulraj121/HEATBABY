import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'stripe'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

serve(async (req) => {
  try {
    const { amount, currency = 'inr', subscription_id } = await req.json()

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to paise
      currency: currency,
      payment_method_types: ['card', 'upi'], // Include UPI for India
      metadata: {
        subscription_id,
      },
    })

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})