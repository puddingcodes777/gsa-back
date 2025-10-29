import Stripe from "stripe";
import { config } from "src/system";

const stripe = new Stripe(config.stripe.key);

export const payWithCard = async (
  description: string,
  amount: number,
  token: string
) => {
  const charge = await stripe.charges.create({
    description,
    amount,
    currency: "usd",
    source: token,
  });

  return { status: charge.status };
};
