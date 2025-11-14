'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Button, CheckoutModal, type TransactionDraft } from '@maany_shr/e-class-ui-kit'
import { TLocale } from '@maany_shr/e-class-translations'
import env from '../../config/env'

export default function CheckoutPage() {
    const searchParams = useSearchParams()
    const locale = useLocale() as TLocale
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
    const couponCode = searchParams.get('coupon')

    // Hardcoded transaction draft for demo purposes
    // In production, this would come from the cart or package selection
    const transactionDraft: TransactionDraft = {
        invoiceLineItems: [
            {
                name: 'Coaching Session',
                description: 'One-on-one coaching session',
                quantity: 1,
                unit_price: 10000, // CHF 100.00 in cents
                total_price: 10000,
            },
            {
                name: 'VAT 7.7%',
                description: 'Swiss Value Added Tax',
                quantity: 1,
                unit_price: 770, // CHF 7.70 in cents
                total_price: 770,
            },
        ],
        currency: 'CHF',
        coupon_code: couponCode,
        final_price: 10770, // CHF 107.70 in cents
    }

    const handlePaymentComplete = (sessionId: string) => {
        console.log('Payment completed with session ID:', sessionId)
        setIsCheckoutOpen(false)
        // Redirect to success page or handle completion
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Checkout</h1>

                <p className="text-gray-600 mb-8">
                    Click the button below to proceed with your payment.
                </p>

                <Button
                    variant="primary"
                    size="big"
                    text="Proceed to Checkout"
                    onClick={() => setIsCheckoutOpen(true)}
                />

                <CheckoutModal
                    isOpen={isCheckoutOpen}
                    onClose={() => setIsCheckoutOpen(false)}
                    transactionDraft={transactionDraft}
                    stripePublishableKey={env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
                    locale={locale}
                    onPaymentComplete={handlePaymentComplete}
                />
            </div>
        </div>
    )
}