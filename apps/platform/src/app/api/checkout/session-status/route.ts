import { stripe } from '../../../../lib/infrastructure/server/config/payments/stripe.config';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
        return Response.json(
            { error: 'Missing session_id parameter' },
            { status: 400 }
        );
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        return Response.json({
            status: session.status,
            customer_email: session.customer_details?.email,
            payment_status: session.payment_status,
        });
    } catch (error) {
        console.error('Error retrieving session:', error);
        return Response.json(
            { error: 'Failed to retrieve session' },
            { status: 500 }
        );
    }
}
