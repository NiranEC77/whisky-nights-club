import { NextRequest, NextResponse } from 'next/server'
import { getActiveMembershipByEmail } from '@/lib/actions/memberships'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email')

    if (!email) {
        return NextResponse.json({ hasMembership: false })
    }

    const membership = await getActiveMembershipByEmail(email)

    return NextResponse.json({
        hasMembership: membership !== null,
        eventsRemaining: membership ? 2 - membership.events_used : 0
    })
}
