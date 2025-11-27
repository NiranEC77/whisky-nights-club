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
    value = 'stripe',
    onChange,
    name = 'payment_method',
    disabled = false
}: PaymentMethodSelectorProps) {
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
                    <SelectItem value="stripe">
                        <div className="flex items-center gap-2">
                            <span>💳</span>
                            <span>Stripe (Credit/Debit Card)</span>
                        </div>
                    </SelectItem>
                    <SelectItem value="paypal">
                        <div className="flex items-center gap-2">
                            <span>🅿️</span>
                            <span>PayPal</span>
                        </div>
                    </SelectItem>
                </SelectContent>
            </Select>
            <p className="text-xs text-whisky-cream/60">
                Choose your preferred payment method
            </p>
        </div>
    )
}
