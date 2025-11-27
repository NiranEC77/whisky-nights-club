export interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: 'admin' | 'member'
  created_at: string
}

export interface Event {
  id: string
  title: string
  description: string | null
  date: string
  start_time: string
  price: number
  max_seats: number
  featured_image: string | null
  created_by: string
  created_at: string
  creator?: Profile
  available_seats?: number
}

export type PaymentMethod = 'stripe' | 'paypal'

export interface Registration {
  id: string
  event_id: string
  user_id: string | null
  full_name: string
  email: string
  phone: string
  ticket_count: number
  payment_status: 'pending' | 'paid'
  payment_method: PaymentMethod
  membership_id: string | null
  is_free_with_membership: boolean
  brought_friend: boolean
  payment_code: string | null
  created_at: string
  event?: Event
}

export interface Membership {
  id: string
  user_id: string | null
  email: string
  full_name: string
  phone: string | null
  start_date: string
  end_date: string
  events_used: number
  friend_used: boolean
  payment_status: 'pending' | 'paid'
  payment_method: PaymentMethod | null
  created_at: string
}

export interface EventWithRegistrations extends Event {
  registrations: Registration[]
  registered_count: number
  available_seats: number
}


