import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { name, price, currency, url } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: name,
              description: `Thanh toán cho ${name}`
            },
            unit_amount: Math.round(price),
          },
          quantity: 1,
        },
      ],
      mode: "payment", // Thanh toán 1 lần
      success_url: `${req.headers.get("origin")}/${url}` + "?status=success",
      cancel_url: `${req.headers.get("origin")}/${url}` + "?status=cancel",
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
