// pages/api/checkout_sessions.ts
import { stripeClient } from '@/lib/stripe';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Get the origin from the request headers.
    const origin = req.headers.origin;

    // Create a Checkout Session with Stripe and include metadata.
    const session = await stripeClient.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (e.g., pr_1234) of the product you want to sell
          price: req.body.priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=true`,
      metadata: {
        userId: req.body.userId,   // Pass the user ID from the client (ensure it is provided)
        credits: req.body.credits, // The number of credits to add
      },
    });

    // Redirect to the session URL if it exists.
    if (session.url) {
      return res.redirect(303, session.url);
    } else {
      throw new Error('Session URL is null');
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return res.status(500).json({ error: errorMessage });
  }
}
