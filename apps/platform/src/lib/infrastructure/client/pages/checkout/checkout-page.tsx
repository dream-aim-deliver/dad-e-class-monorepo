'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from '@maany_shr/e-class-ui-kit'
import EmbeddedCheckoutModal from './components/embedded-checkout-modal'

function extractDiscountFromCoupon(coupon: string): number {
    // Extract number from coupon code (e.g., "XXX5" -> 5, "XXX10" -> 10)
    const match = coupon.match(/\d+/)
    return match ? parseInt(match[0], 10) : 0
}

export default function CheckoutPage() {
    const searchParams = useSearchParams()
    const couponCode = searchParams.get('coupon')
    const discountPercentage = couponCode ? extractDiscountFromCoupon(couponCode) : 0

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Checkout</h1>

                {couponCode && discountPercentage > 0 && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-green-800 font-semibold">
                            Coupon Applied: {couponCode}
                        </p>
                        <p className="text-green-600 text-sm">
                            You will receive {discountPercentage}% off your purchase
                        </p>
                    </div>
                )}

                <p className="text-gray-600 mb-8">
                    Click the button below to proceed with your payment.
                </p>

                <EmbeddedCheckoutModal coupon={couponCode || undefined}>
                    <Button variant="primary" size="big" text="Proceed to Checkout" />
                </EmbeddedCheckoutModal>
            </div>
        </div>
    )
}