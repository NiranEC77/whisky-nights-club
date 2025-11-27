import { getEvents } from '@/lib/actions/events'
import { EventCard } from '@/components/event-card'
import { Wine, Calendar, Users } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const events = await getEvents()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-whisky-bourbon/20 via-whisky-dark to-whisky-dark" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=1920')] bg-cover bg-center opacity-10" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="flex justify-center mb-6">
              <Wine className="h-20 w-20 text-whisky-gold animate-fade-in" />
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-gradient-gold animate-fade-in">
              Redhead WHISKY
            </h1>
            <p className="text-xl md:text-2xl text-whisky-cream/80 animate-fade-in">
              Bringing people together through good drinks, delicious food, and great conversation
            </p>
            <p className="text-lg text-whisky-cream/60 animate-fade-in">
              Join our virtual whisky club experiences
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 border-y border-whisky-gold/20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-3 animate-fade-in">
              <Wine className="h-12 w-12 text-whisky-gold mx-auto" />
              <h3 className="text-xl font-serif font-semibold text-whisky-gold">
                Virtual Tastings
              </h3>
              <p className="text-whisky-cream/70">
                Join from anywhere and taste together as a community
              </p>
            </div>
            <div className="text-center space-y-3 animate-fade-in">
              <Users className="h-12 w-12 text-whisky-gold mx-auto" />
              <h3 className="text-xl font-serif font-semibold text-whisky-gold">
                The Togetherness
              </h3>
              <p className="text-whisky-cream/70">
                Building community through shared whisky experiences
              </p>
            </div>
            <div className="text-center space-y-3 animate-fade-in">
              <Calendar className="h-12 w-12 text-whisky-gold mx-auto" />
              <h3 className="text-xl font-serif font-semibold text-whisky-gold">
                Regular Meetups
              </h3>
              <p className="text-whisky-cream/70">
                Join our club events and discover new favorites together
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gradient-gold mb-4">
              Upcoming Events
            </h2>
            <p className="text-whisky-cream/70 text-lg">
              Reserve your seat at our next exclusive tasting
            </p>
          </div>

          {events.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Wine className="h-16 w-16 text-whisky-gold/40 mx-auto mb-4" />
              <p className="text-whisky-cream/60 text-lg">
                No upcoming events at the moment. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-whisky-gold/20 py-8 px-4 mt-16">
        <div className="container mx-auto text-center text-whisky-cream/60">
          <p>&copy; {new Date().getFullYear()} Redhead WHISKY. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

