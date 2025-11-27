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
}

export interface Registration {
  id: string
  event_id: string
  user_id: string | null
  full_name: string
  email: string
  phone: string
  ticket_count: number
  payment_status: 'pending' | 'paid'
  created_at: string
  event?: Event
}

export interface EventWithRegistrations extends Event {
  registrations: Registration[]
  registered_count: number
  available_seats: number
}

