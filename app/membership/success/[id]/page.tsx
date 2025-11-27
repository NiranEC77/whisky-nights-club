import { notFound } from 'next/navigation'
import { getMembershipById } from '@/lib/actions/memberships'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PaymentInstructions } from '@/components/payment-instructions'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function MembershipSuccessPage({
    params,
}: {
    params: { id: string }
}) {
    const membership = await getMembershipById(params.id)

    if (!membership) {
        notFound()
    }

    const membershipPrice = parseInt(process.env.NEXT_PUBLIC_MEMBERSHIP_PRICE || '100')
    const memo = `MEMBERSHIP-${params.id.slice(0, 8).toUpperCase()}`

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="container mx-auto max-w-2xl">
                <div className="text-center mb-8">
                    <CheckCircle2 className="h-16 w-16 text-whisky-gold mx-auto mb-4" />
                    <h1 className="text-4xl font-serif font-bold text-gradient-gold mb-2">
                        Membership Purchase Successful!
                    </h1>
                    <p className="text-whisky-cream/70">
                        Welcome to the Redhead Whiskey Club
                    </p>
                </div>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Payment Instructions</CardTitle>
                        <CardDescription>
                            Complete your payment to activate your membership
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <PaymentInstructions
                            paymentMethod={membership.payment_method || 'zelle'}
                            amount={membershipPrice}
                            memo={memo}
                        />

                        <div className="bg-whisky-gold/10 border border-whisky-gold/30 rounded-lg p-4">
                            <h3 className="font-semibold mb-2">What happens next?</h3>
                            <ol className="text-sm text-whisky-cream/80 space-y-2">
                                <li>1. Complete your payment using the instructions above</li>
                                <li>2. We'll confirm your payment within 24 hours</li>
                                <li>3. You'll receive a confirmation email with your membership details</li>
                                <li>4. Start using your free event access immediately!</li>
                            </ol>
                        </div>

                        <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-4">
                            <p className="text-sm text-green-300">
                                <strong>💡 Pro Tip:</strong> When registering for events, use the email address <strong>{membership.email}</strong> to automatically apply your membership benefits.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-4">
                    <Link href="/" className="flex-1">
                        <Button variant="outline" className="w-full">
                            Browse Events
                        </Button>
                    </Link>
                    <Link href="/membership" className="flex-1">
                        <Button variant="secondary" className="w-full">
                            Learn More
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
