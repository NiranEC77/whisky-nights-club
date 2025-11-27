'use client'

import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { PaymentMethodSelector } from '@/components/payment-method-selector'
import { formatCurrency } from '@/lib/utils'
import { Event } from '@/lib/types'

interface RegistrationFormClientProps {
    event: Event
    onSubmit: (formData: FormData) => void
}

export function RegistrationFormClient({ event, onSubmit }: RegistrationFormClientProps) {
    const [email, setEmail] = useState('')
    const [ticketCount, setTicketCount] = useState(1)
    const [checkingMembership, setCheckingMembership] = useState(false)
    const [hasMembership, setHasMembership] = useState(false)
    const [membershipData, setMembershipData] = useState<{ hasMembership: boolean, friendUsed: boolean } | null>(null)
    const [showPaymentMethod, setShowPaymentMethod] = useState(true)
    const [broughtFriend, setBroughtFriend] = useState(false)

    // Check for active membership when email changes
    useEffect(() => {
        const checkMembership = async () => {
            if (!email || !email.includes('@')) {
                setHasMembership(false)
                setShowPaymentMethod(true)
                return
            }

            setCheckingMembership(true)
            try {
                const response = await fetch(`/api/check-membership?email=${encodeURIComponent(email)}`)
                const data = await response.json()
                setHasMembership(data.hasMembership)
                setMembershipData(data)
                setShowPaymentMethod(!data.hasMembership)
            } catch (error) {
                console.error('Error checking membership:', error)
                setHasMembership(false)
                setShowPaymentMethod(true)
            } finally {
                setCheckingMembership(false)
            }
        }

        const timeoutId = setTimeout(checkMembership, 500)
        return () => clearTimeout(timeoutId)
    }, [email])

    const totalPrice = event.price * ticketCount

    return (
        <form action={onSubmit} className="space-y-6" id="registration-form">
            <input type="hidden" name="event_id" value={event.id} />

            <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                {checkingMembership && (
                    <p className="text-xs text-whisky-gold">Checking for active membership...</p>
                )}
                {hasMembership && (
                    <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-3">
                        <p className="text-green-300 text-sm font-semibold">
                            ✅ Active Membership Found!
                        </p>
                        <p className="text-green-300/80 text-xs mt-1">
                            This event will be FREE with your membership. No payment required!
                        </p>
                        {!membershipData?.friendUsed && (
                            <p className="text-green-300/80 text-xs mt-1">
                                💚 You can also bring 1 friend for free (one-time benefit)
                            </p>
                        )}
                    </div>
                )}
            </div>

            {hasMembership && !membershipData?.friendUsed && (
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="brought_friend"
                            name="brought_friend"
                            value="true"
                            checked={broughtFriend}
                            onChange={(e) => setBroughtFriend(e.target.checked)}
                            className="h-4 w-4 rounded border-whisky-gold/30 bg-whisky-darker text-whisky-gold focus:ring-whisky-gold"
                        />
                        <Label htmlFor="brought_friend" className="cursor-pointer">
                            I&apos;m bringing a friend (FREE - one-time benefit)
                        </Label>
                    </div>
                    <p className="text-xs text-whisky-cream/60 ml-6">
                        Check this box to use your one-time friend benefit. Your friend gets free entry to this event!
                    </p>
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="ticket_count">How many people registering? *</Label>
                <Select
                    name="ticket_count"
                    value={ticketCount.toString()}
                    onValueChange={(value) => setTicketCount(parseInt(value))}
                    required
                >
                    <SelectTrigger id="ticket_count">
                        <SelectValue placeholder="Select number" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">one is fun - {formatCurrency(event.price)}</SelectItem>
                        <SelectItem value="2" disabled={(event.available_seats || 0) < 2}>
                            two is charm - {formatCurrency(event.price * 2)}
                            {(event.available_seats || 0) < 2 && ' (Not enough seats)'}
                        </SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-xs text-whisky-cream/60">
                    {event.available_seats || 0} seat(s) available
                </p>
            </div>

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
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    required
                    minLength={10}
                />
            </div>

            {showPaymentMethod && !hasMembership && (
                <>
                    <PaymentMethodSelector />

                    <div className="space-y-2">
                        <Label htmlFor="payment_code">Payment Code (Optional)</Label>
                        <Input
                            id="payment_code"
                            name="payment_code"
                            placeholder="Enter code if you have one"
                        />
                        <p className="text-xs text-whisky-cream/60">
                            For testing purposes only
                        </p>
                    </div>

                    <div className="bg-yellow-900/20 border-2 border-yellow-500/50 rounded-lg p-4">
                        <p className="text-yellow-300 font-semibold text-sm flex items-center gap-2">
                            <span className="text-2xl">⚠️</span>
                            <span>Payment Required to Attend</span>
                        </p>
                        <p className="text-yellow-200/80 text-xs mt-2">
                            After clicking &quot;Register &amp; Get Payment Instructions&quot;, you MUST complete payment to confirm your spot.
                            Your registration will be <strong>pending</strong> until payment is received and confirmed by our team.
                        </p>
                    </div>
                </>
            )}

            <div className="border-t border-whisky-gold/20 pt-6 space-y-3">
                <h3 className="font-semibold text-lg">Event Summary</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-whisky-cream/60">Event</span>
                        <span>{event.title}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-whisky-cream/60">Date</span>
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-whisky-cream/60">Time</span>
                        <span>{event.start_time}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-whisky-cream/60">Price per Ticket</span>
                        <span>{formatCurrency(event.price)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-base pt-2 border-t border-whisky-gold/20">
                        <span>Total {!hasMembership && 'Due'}</span>
                        {hasMembership ? (
                            <span className="text-green-400">FREE with Membership! 🎉</span>
                        ) : (
                            <span className="text-whisky-gold">{formatCurrency(totalPrice)}</span>
                        )}
                    </div>
                </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
                {hasMembership ? 'Confirm Registration (FREE)' : 'Register & Get Payment Instructions'}
            </Button>

            <p className="text-xs text-center text-whisky-cream/60">
                {hasMembership ? (
                    <>Your membership benefit will be applied automatically. You&apos;re all set!</>
                ) : (
                    <>
                        <strong>Important:</strong> You will receive payment instructions after registration.
                        Payment must be completed within 24 hours to secure your spot.
                    </>
                )}
            </p>
        </form>
    )
}
