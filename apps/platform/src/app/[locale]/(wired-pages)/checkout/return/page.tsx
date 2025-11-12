'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function CheckoutReturnPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('')
    const [email, setEmail] = useState<string | null>(null)

    useEffect(() => {
        const sessionId = searchParams.get('session_id')

        if (!sessionId) {
            setStatus('error')
            setMessage('Missing session information')
            return
        }

        // Fetch session status from our API
        fetch(`/api/checkout/session-status?session_id=${sessionId}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 'complete') {
                    setStatus('success')
                    setEmail(data.customer_email)
                } else if (data.status === 'open') {
                    setStatus('error')
                    setMessage('Payment not completed. Redirecting...')
                    setTimeout(() => router.push('/checkout'), 2000)
                } else {
                    setStatus('error')
                    setMessage('Unable to verify payment status')
                }
            })
            .catch((error) => {
                console.error('Error fetching session status:', error)
                setStatus('error')
                setMessage('An error occurred while verifying your payment')
            })
    }, [searchParams, router])

    if (status === 'loading') {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                    </div>
                    <p className="text-gray-600">Verifying your payment...</p>
                </div>
            </div>
        )
    }

    if (status === 'success') {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="mb-6">
                        <svg
                            className="w-16 h-16 text-green-600 mx-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold mb-4 text-green-600">
                        Payment Successful!
                    </h1>
                    <p className="text-gray-600 mb-4">
                        Thank you for your purchase!
                        {email && (
                            <> A confirmation email has been sent to{' '}
                            <strong>{email}</strong>.</>
                        )}
                    </p>
                    <p className="text-gray-500">
                        If you have any questions, please contact our support team.
                    </p>
                </div>
            </div>
        )
    }

    // Error state
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto text-center">
                <h1 className="text-3xl font-bold mb-6 text-red-600">Payment Issue</h1>
                <p className="text-gray-600 mb-8">
                    {message || 'Unable to confirm payment status. Please contact support if you believe this is an error.'}
                </p>
                <button
                    onClick={() => router.push('/checkout')}
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Return to Checkout
                </button>
            </div>
        </div>
    )
}
