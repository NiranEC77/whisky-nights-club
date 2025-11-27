import { redirect } from 'next/navigation'
import { signIn } from '@/lib/actions/auth'
import { getCurrentUser } from '@/lib/actions/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DramGlass } from '@/components/icons/dram-glass'

export default async function LoginPage({
  searchParams
}: {
  searchParams: { error?: string }
}) {
  const user = await getCurrentUser()

  if (user) {
    redirect('/admin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <DramGlass className="h-12 w-12 text-whisky-gold mx-auto mb-4" />
          <h1 className="text-3xl font-serif font-bold text-gradient-gold mb-2">
            Admin Sign In
          </h1>
          <p className="text-whisky-cream/70">
            Manage your whiskey club events
          </p>
        </div>

        {searchParams.error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
            <p className="text-red-300 text-sm">
              <strong>Error:</strong> {searchParams.error}
            </p>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={signIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@redheadwhiskey.com"
                    required
                  />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

