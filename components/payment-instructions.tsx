import { PaymentMethod } from '@/lib/types'
import { CopyButton } from './copy-button'

interface PaymentInstructionsProps {
    paymentMethod: PaymentMethod
    amount: number
    memo: string
}

export function PaymentInstructions({ paymentMethod, amount, memo }: PaymentInstructionsProps) {
    const venmoUsername = process.env.NEXT_PUBLIC_VENMO_USERNAME
    const paypalEmail = process.env.NEXT_PUBLIC_PAYPAL_EMAIL
    const zelleEmail = process.env.NEXT_PUBLIC_ZELLE_EMAIL
    const zellePhone = process.env.NEXT_PUBLIC_ZELLE_PHONE
    const googlepayEmail = process.env.NEXT_PUBLIC_GOOGLEPAY_EMAIL
    const googlepayPhone = process.env.NEXT_PUBLIC_GOOGLEPAY_PHONE

    const renderInstructions = () => {
        switch (paymentMethod) {
            case 'venmo':
                return (
                    <>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <p className="text-sm text-whisky-cream/60">Venmo Username</p>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 bg-whisky-dark/50 px-3 py-2 rounded text-whisky-gold">
                                        {venmoUsername || 'Not configured'}
                                    </code>
                                    {venmoUsername && <CopyButton text={venmoUsername} />}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3 text-sm text-whisky-cream/70 mt-4">
                            <p className="flex items-start gap-2">
                                <span className="text-whisky-gold mt-1">1.</span>
                                <span>Open the Venmo app</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="text-whisky-gold mt-1">2.</span>
                                <span>Search for {venmoUsername}</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="text-whisky-gold mt-1">3.</span>
                                <span>Send ${amount.toFixed(2)}</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="text-whisky-gold mt-1">4.</span>
                                <span>Include the memo: {memo}</span>
                            </p>
                        </div>
                    </>
                )

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
                                <span>Click "Send & Request"</span>
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

            case 'googlepay':
                return (
                    <>
                        <div className="space-y-3">
                            {googlepayEmail && (
                                <div className="space-y-1">
                                    <p className="text-sm text-whisky-cream/60">Google Pay Email</p>
                                    <div className="flex items-center gap-2">
                                        <code className="flex-1 bg-whisky-dark/50 px-3 py-2 rounded text-whisky-gold">
                                            {googlepayEmail}
                                        </code>
                                        <CopyButton text={googlepayEmail} />
                                    </div>
                                </div>
                            )}
                            {googlepayPhone && (
                                <div className="space-y-1">
                                    <p className="text-sm text-whisky-cream/60">Google Pay Phone</p>
                                    <div className="flex items-center gap-2">
                                        <code className="flex-1 bg-whisky-dark/50 px-3 py-2 rounded text-whisky-gold">
                                            {googlepayPhone}
                                        </code>
                                        <CopyButton text={googlepayPhone} />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="space-y-3 text-sm text-whisky-cream/70 mt-4">
                            <p className="flex items-start gap-2">
                                <span className="text-whisky-gold mt-1">1.</span>
                                <span>Open Google Pay app</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="text-whisky-gold mt-1">2.</span>
                                <span>Tap "New Payment"</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="text-whisky-gold mt-1">3.</span>
                                <span>Send ${amount.toFixed(2)} to the email/phone above</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="text-whisky-gold mt-1">4.</span>
                                <span>Include the note: {memo}</span>
                            </p>
                        </div>
                    </>
                )

            case 'zelle':
            default:
                return (
                    <>
                        <div className="space-y-3">
                            {zelleEmail && (
                                <div className="space-y-1">
                                    <p className="text-sm text-whisky-cream/60">Zelle Email</p>
                                    <div className="flex items-center gap-2">
                                        <code className="flex-1 bg-whisky-dark/50 px-3 py-2 rounded text-whisky-gold">
                                            {zelleEmail}
                                        </code>
                                        <CopyButton text={zelleEmail} />
                                    </div>
                                </div>
                            )}
                            {zellePhone && (
                                <div className="space-y-1">
                                    <p className="text-sm text-whisky-cream/60">Zelle Phone</p>
                                    <div className="flex items-center gap-2">
                                        <code className="flex-1 bg-whisky-dark/50 px-3 py-2 rounded text-whisky-gold">
                                            {zellePhone}
                                        </code>
                                        <CopyButton text={zellePhone} />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="space-y-3 text-sm text-whisky-cream/70 mt-4">
                            <p className="flex items-start gap-2">
                                <span className="text-whisky-gold mt-1">1.</span>
                                <span>Open your Zelle app or your banking app with Zelle integration</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="text-whisky-gold mt-1">2.</span>
                                <span>Send ${amount.toFixed(2)} to the email/phone above</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="text-whisky-gold mt-1">3.</span>
                                <span>Include the memo exactly as shown above</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="text-whisky-gold mt-1">4.</span>
                                <span>You&apos;ll receive a confirmation email within 24 hours of payment</span>
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
                    <p className="text-sm text-whisky-cream/60">Memo / Note (Required)</p>
                    <div className="flex items-center gap-2">
                        <code className="flex-1 bg-whisky-dark/50 px-3 py-2 rounded text-whisky-gold">
                            {memo}
                        </code>
                        <CopyButton text={memo} />
                    </div>
                    <p className="text-xs text-whisky-cream/60 mt-2">
                        ⚠️ Please include this memo in your payment to help us identify your registration
                    </p>
                </div>
            </div>
        </div>
    )
}
