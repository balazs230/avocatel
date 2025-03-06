/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/webhook.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import { stripeClient } from "@/lib/stripe";
import supabaseClient from "@/lib/supabase";

// Disable bodyParser so we can read the raw body
export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    // Verify the event came from Stripe
    event = stripeClient.webhooks.constructEvent(
      buf,
      sig as string,
      webhookSecret as string
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    console.log("Checkout session completed:", session);

    // Extract metadata. Make sure you included these when creating the checkout session.
    const userId = session.metadata?.userId;
    const purchasedCredits = parseInt(session.metadata?.credits || "0", 10);

    console.log("Extracted Metadata:", { userId, purchasedCredits });

    // Only update credits if metadata is valid
    if (userId && purchasedCredits > 0) {
      try {
        // Fetch the current profile
        const { data: profile, error: fetchError } = await supabaseClient
          .from("profiles")
          .select("credits")
          .eq("id", userId)
          .limit(1)
          .maybeSingle();

        if (fetchError) {
          console.error("Error fetching profile:", fetchError.message);
        } else if (profile) {
          const newCredits = (profile.credits || 0) + purchasedCredits;
          const { error: updateError } = await supabaseClient
            .from("profiles")
            .update({ credits: newCredits })
            .eq("id", userId);

          if (updateError) {
            console.error("Error updating credits:", updateError.message);
          } else {
            console.log(
              `Credits updated for user ${userId}: ${profile.credits} -> ${newCredits}`
            );
          }
        } else {
          console.error(`No profile found for user ${userId}`);
        }
      } catch (error) {
        console.error("Error processing webhook event:", error);
      }
    } else {
      console.error("Missing or invalid metadata. Skipping credit update.");
    }
  } else {
    // Handle other event types if needed
    console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true });
}
