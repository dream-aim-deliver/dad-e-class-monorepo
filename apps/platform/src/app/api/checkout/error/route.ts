import { redirect } from 'next/navigation'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const canceled = searchParams.get('canceled');

    // Redirect to the error page
    // Using 'en' as default locale, you may want to get this from cookies/headers
    redirect(`/en/checkout/error?canceled=${canceled || 'false'}`);
}
