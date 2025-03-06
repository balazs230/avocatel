// pages/success.tsx
import { stripeClient } from "@/lib/stripe";
import { supabaseClient } from "@/lib/supabase";
import { GetServerSideProps } from "next";
import Link from "next/link";

interface SuccessProps {
  customerEmail: string;
}

export const getServerSideProps: GetServerSideProps<SuccessProps> = async (
  context
) => {
  const session_id = context.query.session_id;

  // If no session_id is provided or it's not a string, redirect to home.
  if (!session_id || typeof session_id !== "string") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  try {
    // Retrieve the session from Stripe.
    const session = await stripeClient.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    });

    // Debug: log the entire session and metadata.
    console.log("Stripe Session:", session);
    console.log("Session Metadata:", session.metadata);

    // If the session is still open, redirect back to home.
    if (session.status === "open") {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const customerEmail = session.customer_details?.email || "";

    // Extract metadata (they come in as strings).
    const purchasedCredits = parseInt(session.metadata?.credits || "0", 10);
    const userId = session.metadata?.userId;

    console.log("Extracted Metadata:", { purchasedCredits, userId });

    // Update credits only if metadata is valid.
    if (userId && purchasedCredits > 0) {
      // Fetch the current profile; limit to one record and use maybeSingle() to handle no row gracefully.
      const { data: profile, error: fetchError } = await supabaseClient
        .from("profiles")
        .select("credits")
        .eq("id", userId)
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        console.error("Error fetching profile:", fetchError.message);
      } else if (profile) {
        // Calculate the new credits.
        const newCredits = (profile.credits || 0) + purchasedCredits;

        // Update the credits value in the database.
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
    } else {
      console.log("Metadata missing or invalid. Skipping credit update.");
    }

    return {
      props: {
        customerEmail,
      },
    };
  } catch (error) {
    console.error("Error retrieving Stripe session:", error);
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};

const Success = ({ customerEmail }: SuccessProps) => {
  return (
    <section
      id="success"
      className="text-center flex flex-col gap-10 items-center p-10"
    >
      <p>
        We appreciate your business! A confirmation email will be sent to{" "}
        <strong>{customerEmail}</strong>. If you have any questions, please
        email{" "}
      </p>
      <a href="mailto:orders@example.com">orders@example.com</a>
      <Link href="/" className="p-5 bg-orange-400 w-max">
        Go to homepage
      </Link>
    </section>
  );
};

export default Success;
