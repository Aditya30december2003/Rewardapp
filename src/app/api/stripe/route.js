import { createAdminClient } from "@/appwrite/config";
import { createNewPerktifyUser } from "@/lib/actions";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { ID } from "node-appwrite";

export async function POST(req) {
  const body = await req.text();

  const signature = headers().get("Stripe-Signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return new Response("webhook error; Signature Donot Matched", {
      status: 400,
    });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      const CustomerID = session.metadata?.CustomerID;

      console.log("Databases initialized:");
      if (CustomerID) {
      
        //set the upgrade field to true In Subscription collection
        console.log(`Generating Subscribers... `);
        const { databases } = await createAdminClient();
        await databases.updateDocument(
          process.env.NEXT_PUBLIC_SUBSCRIPTION_DATABASE_ID,
          process.env.NEXT_PUBLIC_SUBSCRIBERS_COLLECTION_ID,
          CustomerID,
          {
            PremiumPlan: session.payment_status === "paid",
          }
        );
        console.log(`Subscribers data updated ... `);
      } else {
        console.log("CustomerID missing ");
      }

      break;
    }
    default: {
      console.log("unhandled event", event.type);
    }
  }

  return new Response(null, { status: 200 });
}
