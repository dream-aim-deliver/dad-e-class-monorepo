export default async function CheckoutErrorPage({
    searchParams: searchParamsPromise,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await searchParamsPromise;
    const canceled = searchParams.canceled === 'true';

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto text-center">
                <h1 className="text-3xl font-bold mb-6 text-red-600">
                    {canceled ? 'Payment Canceled' : 'Payment Error'}
                </h1>
                <p className="text-gray-600 mb-8">
                    {canceled
                        ? 'You have canceled the payment process. No charges were made.'
                        : 'An error occurred during the payment process. Please try again.'}
                </p>
                <a
                    href="/en/checkout"
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Return to Checkout
                </a>
            </div>
        </div>
    );
}
