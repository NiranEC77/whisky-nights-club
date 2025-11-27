import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/actions/auth'
import { getAllUsers, createAdminUser, updateUserRole } from '@/lib/actions/users'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, UserPlus, Shield, User } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function UsersPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== 'admin') {
    redirect('/login')
  }

  const result = await getAllUsers()

  if (result.error) {
    return <div>Error loading users</div>
  }

  const users = result.data || []

  async function handleCreateUser(formData: FormData) {
    'use server'
    
    const result = await createAdminUser(formData)
    
    if (result.error) {
      console.error(result.error)
      redirect(`/admin/users?error=${encodeURIComponent(result.error)}`)
    }
    
    redirect('/admin/users?success=User created successfully')
  }

  async function handleUpdateRole(formData: FormData) {
    'use server'
    
    const userId = formData.get('user_id') as string
    const role = formData.get('role') as 'admin' | 'member'
    
    await updateUserRole(userId, role)
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <Link href="/admin">
            <Button variant="ghost" className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-serif font-bold text-gradient-gold mb-2">
            User Management
          </h1>
          <p className="text-whisky-cream/70">
            Manage admin access and user roles
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Create User Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Add New User
                </CardTitle>
                <CardDescription>
                  Create a new admin or member account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form action={handleCreateUser} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="admin@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Min 6 characters"
                      minLength={6}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      placeholder="John Smith"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select name="role" defaultValue="member" required>
                      <SelectTrigger id="role">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full">
                    Create User
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Users List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>
                  {users.length} user(s) in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                {users.length > 0 ? (
                  <div className="space-y-4">
                    {users.map((userItem) => (
                      <div
                        key={userItem.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-whisky-gold/20"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-whisky-gold">
                              {userItem.full_name || 'No name'}
                            </h3>
                            {userItem.role === 'admin' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-whisky-gold/20 text-whisky-gold border border-whisky-gold/30">
                                <Shield className="h-3 w-3" />
                                Admin
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-whisky-cream/10 text-whisky-cream/60 border border-whisky-cream/20">
                                <User className="h-3 w-3" />
                                Member
                              </span>
                            )}
                            {userItem.id === user.id && (
                              <span className="text-xs text-whisky-cream/60">(You)</span>
                            )}
                          </div>
                          <p className="text-sm text-whisky-cream/70">{userItem.email}</p>
                          <p className="text-xs text-whisky-cream/50 mt-1">
                            Joined {new Date(userItem.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        {userItem.id !== user.id && (
                          <form action={handleUpdateRole} className="flex gap-2">
                            <input type="hidden" name="user_id" value={userItem.id} />
                            <Select name="role" defaultValue={userItem.role}>
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="member">Member</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button type="submit" size="sm" variant="outline">
                              Update
                            </Button>
                          </form>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-whisky-cream/60">No users found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

