import { createCheckoutSession } from '../../../../../lib/infrastructure/server/config/payments/stripe.config';

// TODO: change env variables for success and cancel URLs
export async function GET(
  req: Request,
) {
    const checkoutSession = await createCheckoutSession(1000, 'http://localhost:3000/api/checkout/success?session_id={CHECKOUT_SESSION_ID}', 'http://localhost:3000/api/checkout/error?canceled=true');
    // Save the session ID and other details to your database
    console.log('Created checkout session:', JSON.stringify(checkoutSession));

    return Response.json({
        clientSecret: checkoutSession.client_secret,
        sessionId: checkoutSession.id
    });
}