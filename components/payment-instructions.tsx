import { PaymentMethod } from '@/lib/types'
import { CopyButton } from './copy-button'

interface PaymentInstructionsProps {
    paymentMethod: PaymentMethod
    amount: number
    memo: string
}

export function PaymentInstructions({ paymentMethod, amount, memo }: PaymentInstructionsProps) {
    const paypalEmail = process.env.NEXT_PUBLIC_PAYPAL_EMAIL

    const renderInstructions = () => {
        switch (paymentMethod) {
            case 'paypal':
                return (
                    <>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <p className="text-sm text-whisky-cream/60">PayPal Email</p>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 bg-whisky-dark/50 px-3 py-2 rounded text-whisky-gold">
                                        {paypalEmail || 'Not configured'}
                                    </code>
                                    {paypalEmail && <CopyButton text={paypalEmail} />}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3 text-sm text-whisky-cream/70 mt-4">
                            <p className="flex items-start gap-2">
                                <span className="text-whisky-gold mt-1">1.</span>
                                <span>Go to PayPal.com or open the PayPal app</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="text-whisky-gold mt-1">2.</span>
                                <span>Click &quot;Send &amp; Request&quot;</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="text-whisky-gold mt-1">3.</span>
                                <span>Send ${amount.toFixed(2)} to {paypalEmail}</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="text-whisky-gold mt-1">4.</span>
                                <span>Include the note: {memo}</span>
                            </p>
                        </div>
                    </>
                )

            case 'stripe':
            default:
                return (
                    <>
                        <div className="space-y-3 text-sm text-whisky-cream/70">
                            <p className="flex items-start gap-2">
                                <span className="text-whisky-gold mt-1">1.</span>
                                <span>You will receive a Stripe payment link via email</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="text-whisky-gold mt-1">2.</span>
                                <span>Click the link to securely pay with credit/debit card</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="text-whisky-gold mt-1">3.</span>
                                <span>Payment amount: ${amount.toFixed(2)}</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="text-whisky-gold mt-1">4.</span>
                                <span>You&apos;ll receive confirmation once payment is processed</span>
                            </p>
                        </div>
                    </>
                )
        }
    }

    return (
        <div className="bg-whisky-darker/80 rounded-lg p-6 space-y-4">
            <div className="space-y-2">
                <p className="text-sm text-whisky-cream/60">Amount to Pay</p>
                <p className="text-3xl font-bold text-whisky-gold">
                    ${amount.toFixed(2)}
                </p>
            </div>

            <div className="border-t border-whisky-gold/20 pt-4 space-y-3">
                {renderInstructions()}

                <div className="space-y-1 mt-4">
                    <p className="text-sm text-whisky-cream/60">Reference / Memo (Required)</p>
                    <div className="flex items-center gap-2">
                        <code className="flex-1 bg-whisky-dark/50 px-3 py-2 rounded text-whisky-gold">
                            {memo}
                        </code>
                        <CopyButton text={memo} />
                    </div>
                    <p className="text-xs text-whisky-cream/60 mt-2">
                        ⚠️ Please include this reference in your payment to help us identify your {paymentMethod === 'stripe' ? 'transaction' : 'payment'}
                    </p>
                </div>
            </div>
        </div>
    )
}
