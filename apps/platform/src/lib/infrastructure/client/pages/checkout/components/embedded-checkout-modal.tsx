'use client'

import { useState, useCallback } from 'react'
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js'
import { Dialog, DialogTrigger, DialogContent } from '@maany_shr/e-class-ui-kit'
import { getStripe } from '../../../config/stripe.config'

interface EmbeddedCheckoutModalProps {
  children: React.ReactNode
  coupon?: string
}

export default function EmbeddedCheckoutModal({ children, coupon }: EmbeddedCheckoutModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchClientSecret = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const url = coupon
        ? `/api/checkout/get-checkout-url?coupon=${encodeURIComponent(coupon)}`
        : '/api/checkout/get-checkout-url'

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const data = await response.json()

      if (!data.clientSecret) {
        throw new Error('No client secret returned from server')
      }

      setClientSecret(data.clientSecret)
      return data.clientSecret
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      console.error('Error fetching client secret:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [coupon])

  const handleOpenChange = useCallback(async (open: boolean) => {
    setIsOpen(open)

    if (open && !clientSecret) {
      try {
        await fetchClientSecret()
      } catch (err) {
        // Error is already handled in fetchClientSecret
        setIsOpen(false)
      }
    }
  }, [clientSecret, fetchClientSecret])

  const options = clientSecret ? { clientSecret } : null

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent
        showCloseButton
        closeOnOverlayClick={false}
        closeOnEscape
        className="max-w-2xl w-full"
      >
        <div className="p-6">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {options && !isLoading && !error && (
            <EmbeddedCheckoutProvider stripe={getStripe()} options={options}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
