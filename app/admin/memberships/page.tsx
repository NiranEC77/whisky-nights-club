import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAllMemberships, updateMembershipPaymentStatus, deleteMembership } from '@/lib/actions/memberships'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminMembershipsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Verify user is admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        redirect('/')
    }

    const result = await getAllMemberships()
    const memberships = result.data || []

    const membershipPrice = parseInt(process.env.NEXT_PUBLIC_MEMBERSHIP_PRICE || '100')

    async function markAsPaid(formData: FormData) {
        'use server'
        const membershipId = formData.get('membership_id') as string
        await updateMembershipPaymentStatus(membershipId, 'paid')
        redirect('/admin/memberships')
    }

    async function markAsPending(formData: FormData) {
        'use server'
        const membershipId = formData.get('membership_id') as string
        await updateMembershipPaymentStatus(membershipId, 'pending')
        redirect('/admin/memberships')
    }

    async function handleDelete(formData: FormData) {
        'use server'
        const membershipId = formData.get('membership_id') as string
        await deleteMembership(membershipId)
        redirect('/admin/memberships')
    }

    const activeMemberships = memberships.filter(m =>
        m.payment_status === 'paid' && new Date(m.end_date) >= new Date()
    )
    const pendingMemberships = memberships.filter(m => m.payment_status === 'pending')
    const expiredMemberships = memberships.filter(m =>
        m.payment_status === 'paid' && new Date(m.end_date) < new Date()
    )

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-gradient-gold mb-2">
                            Membership Management
                        </h1>
                        <p className="text-whisky-cream/70">
                            Manage all club memberships
                        </p>
                    </div>
                    <Link href="/admin">
                        <Button variant="outline">Back to Admin</Button>
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-green-400">{activeMemberships.length}</CardTitle>
                            <CardDescription>Active Memberships</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-yellow-400">{pendingMemberships.length}</CardTitle>
                            <CardDescription>Pending Payment</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-gray-400">{expiredMemberships.length}</CardTitle>
                            <CardDescription>Expired</CardDescription>
                        </CardHeader>
                    </Card>
                </div>

                {pendingMemberships.length > 0 && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Pending Memberships</CardTitle>
                            <CardDescription>Awaiting payment confirmation</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {pendingMemberships.map((membership) => (
                                    <div key={membership.id} className="flex items-center justify-between p-4 bg-whisky-darker/50 rounded-lg">
                                        <div className="flex-1">
                                            <p className="font-semibold">{membership.full_name}</p>
                                            <p className="text-sm text-whisky-cream/60">{membership.email}</p>
                                            <p className="text-xs text-whisky-cream/40">
                                                Purchased: {new Date(membership.created_at).toLocaleDateString()} •
                                                Payment: {membership.payment_method}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <form action={markAsPaid}>
                                                <input type="hidden" name="membership_id" value={membership.id} />
                                                <Button type="submit" size="sm">Mark as Paid</Button>
                                            </form>
                                            <form action={handleDelete}>
                                                <input type="hidden" name="membership_id" value={membership.id} />
                                                <Button type="submit" variant="destructive" size="sm">Delete</Button>
                                            </form>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Active Memberships</CardTitle>
                        <CardDescription>Currently active memberships</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {activeMemberships.length === 0 ? (
                            <p className="text-whisky-cream/60 text-center py-8">No active memberships yet</p>
                        ) : (
                            <div className="space-y-4">
                                {activeMemberships.map((membership) => (
                                    <div key={membership.id} className="flex items-center justify-between p-4 bg-whisky-darker/50 rounded-lg">
                                        <div className="flex-1">
                                            <p className="font-semibold">{membership.full_name}</p>
                                            <p className="text-sm text-whisky-cream/60">{membership.email}</p>
                                            <p className="text-xs text-whisky-cream/40">
                                                Free entry: {membership.events_used}/1 used •
                                                Friend benefit: {membership.friend_used ? 'Used ✓' : 'Available'} •
                                                Expires: {new Date(membership.end_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <form action={markAsPending}>
                                                <input type="hidden" name="membership_id" value={membership.id} />
                                                <Button type="submit" variant="outline" size="sm">Mark Unpaid</Button>
                                            </form>
                                            <form action={handleDelete}>
                                                <input type="hidden" name="membership_id" value={membership.id} />
                                                <Button type="submit" variant="destructive" size="sm">Delete</Button>
                                            </form>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
