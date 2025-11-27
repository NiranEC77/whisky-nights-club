'use client'

import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PaymentMethod } from '@/lib/types'

interface PaymentMethodSelectorProps {
    value?: PaymentMethod
    onChange?: (value: PaymentMethod) => void
    name?: string
    disabled?: boolean
}

export function PaymentMethodSelector({
    value = 'zelle',
    onChange,
    name = 'payment_method',
    disabled = false
}: PaymentMethodSelectorProps) {
    // Check which payment methods are configured
    const hasVenmo = !!process.env.NEXT_PUBLIC_VENMO_USERNAME
    const hasPayPal = !!process.env.NEXT_PUBLIC_PAYPAL_EMAIL
    const hasZelle = !!process.env.NEXT_PUBLIC_ZELLE_EMAIL
    const hasGooglePay = !!(process.env.NEXT_PUBLIC_GOOGLEPAY_EMAIL || process.env.NEXT_PUBLIC_GOOGLEPAY_PHONE)

    return (
        <div className="space-y-2">
            <Label htmlFor={name}>Payment Method *</Label>
            <Select
                name={name}
                defaultValue={value}
                onValueChange={onChange}
                disabled={disabled}
                required
            >
                <SelectTrigger id={name}>
                    <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                    {hasZelle && (
                        <SelectItem value="zelle">
                            <div className="flex items-center gap-2">
                                <span>💳</span>
                                <span>Zelle</span>
                            </div>
                        </SelectItem>
                    )}
                    {hasVenmo && (
                        <SelectItem value="venmo">
                            <div className="flex items-center gap-2">
                                <span>💙</span>
                                <span>Venmo</span>
                            </div>
                        </SelectItem>
                    )}
                    {hasPayPal && (
                        <SelectItem value="paypal">
                            <div className="flex items-center gap-2">
                                <span>🅿️</span>
                                <span>PayPal</span>
                            </div>
                        </SelectItem>
                    )}
                    {hasGooglePay && (
                        <SelectItem value="googlepay">
                            <div className="flex items-center gap-2">
                                <span>🔵</span>
                                <span>Google Pay</span>
                            </div>
                        </SelectItem>
                    )}
                </SelectContent>
            </Select>
            <p className="text-xs text-whisky-cream/60">
                Choose your preferred payment method
            </p>
        </div>
    )
}
