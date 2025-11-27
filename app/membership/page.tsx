import { redirect } from 'next/navigation'
import { createMembership } from '@/lib/actions/memberships'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PaymentMethodSelector } from '@/components/payment-method-selector'
import { CheckCircle2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function MembershipPage({
    searchParams
}: {
    searchParams: { error?: string }
}) {
    const membershipPrice = parseInt(process.env.NEXT_PUBLIC_MEMBERSHIP_PRICE || '100')
    const freeEvents = parseInt(process.env.NEXT_PUBLIC_MEMBERSHIP_FREE_EVENTS || '2')

    async function handlePurchase(formData: FormData) {
        'use server'

        const result = await createMembership(formData)

        if (result.error) {
            console.error('Membership purchase error:', result.error)
            redirect(`/membership?error=${encodeURIComponent(result.error)}`)
        }

        if (result.data) {
            redirect(`/membership/success/${result.data.id}`)
        }
    }

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-serif font-bold text-gradient-gold mb-2">
                        Yearly Membership
                    </h1>
                    <p className="text-whisky-cream/70">
                        Join our exclusive whisky club with premium benefits
                    </p>
                </div>

                {searchParams.error && (
                    <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg max-w-2xl mx-auto">
                        <p className="text-red-300 text-sm">
                            <strong>Error:</strong> {searchParams.error}
                        </p>
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Membership Benefits</CardTitle>
                            <CardDescription>What you get with your membership</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-whisky-gold mt-0.5" />
                                <div>
                                    <p className="font-semibold">1 Free Event Entry</p>
                                    <p className="text-sm text-whisky-cream/60">
                                        Attend one whisky tasting event absolutely free during your membership year
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-whisky-gold mt-0.5" />
                                <div>
                                    <p className="font-semibold">Bring 1 Friend Free (One-Time)</p>
                                    <p className="text-sm text-whisky-cream/60">
                                        Bring a friend to any event for free - one-time benefit during your membership year
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-whisky-gold mt-0.5" />
                                <div>
                                    <p className="font-semibold">Priority Registration</p>
                                    <p className="text-sm text-whisky-cream/60">
                                        Get first access to new events and exclusive tastings
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-whisky-gold mt-0.5" />
                                <div>
                                    <p className="font-semibold">Valid for 1 Year</p>
                                    <p className="text-sm text-whisky-cream/60">
                                        Membership benefits active for 365 days from purchase
                                    </p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-whisky-gold/20">
                                <p className="text-2xl font-bold text-whisky-gold">
                                    ${membershipPrice}/year
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Purchase Membership</CardTitle>
                            <CardDescription>
                                Fill in your details to get started
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form action={handlePurchase} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="full_name">Full Name *</Label>
                                    <Input
                                        id="full_name"
                                        name="full_name"
                                        placeholder="John Smith"
                                        required
                                        minLength={2}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address *</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        required
                                    />
                                    <p className="text-xs text-whisky-cream/60">
                                        Use this email when registering for events to get your free access
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="(555) 123-4567"
                                    />
                                </div>

                                <PaymentMethodSelector />

                                <Button type="submit" className="w-full" size="lg">
                                    Purchase Membership - ${membershipPrice}
                                </Button>

                                <p className="text-xs text-center text-whisky-cream/60">
                                    By purchasing, you agree to receive payment instructions and membership confirmation.
                                </p>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
