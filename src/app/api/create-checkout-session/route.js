import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { planName, price } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "vnd",
            product_data: {
              name: planName,
              description: `Thanh toán cho ${planName}`
            },
            unit_amount: Math.round(price),
          },
          quantity: 1,
        },
      ],
      mode: "payment", // Thanh toán 1 lần
      success_url: `${req.headers.get("origin")}/membership` + "?status=success",
      cancel_url: `${req.headers.get("origin")}/membership` + "?status=cancel",
    });

    return NextResponse.json({ 
        success: true,
        sessionId: session.id
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        success: false,
        message: err.message,
      },
      { status: 500 }
    );
  }
}
