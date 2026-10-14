/**
 * Everything factual on this site comes from the current ltsblackcars.com:
 * the phone, address, owner story, services, pricing model and policies.
 * Anything marked "copy" is new wording written for the redesign — worth a read from the owner.
 */

export const business = {
  name: 'LATS Black Cars',
  legalName: 'Lammi Airport Transportation Service',
  short: 'LATS',
  owner: 'Getachew Woyessa',
  phone: '614-483-5876',
  phoneHref: 'tel:+16144835876',
  smsNumber: '+16144835876',
  street: '7185 Susannah Drive',
  cityLine: 'Reynoldsburg, OH 43068',
  mapsHref: 'https://www.google.com/maps/search/?api=1&query=7185+Susannah+Drive+Reynoldsburg+OH+43068',
}

export const nav = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/fleet', label: 'Fleet' },
  { to: '/about', label: 'About' },
] as const

export const serviceOptions = [
  'Airport transfer',
  'Corporate / executive',
  'Convention',
  'Wedding / special occasion',
  'Concert, sports or night out',
  'Prom, bachelor / bachelorette',
  'Something else',
] as const

export type ServiceOption = (typeof serviceOptions)[number]

export type ServiceItem = {
  id: string
  no: string
  title: string
  line: string
  body: string
  image: string
  position?: string
  tags: string[]
  /** which choice this preselects on the booking form */
  option: ServiceOption
}

export const services: ServiceItem[] = [
  {
    id: 'airport',
    no: '01',
    title: 'Airport transfers',
    line: 'Met at baggage claim by your chauffeur.',
    body: 'Your chauffeur will be waiting at baggage claim level, at the bottom of the escalator nearest your carousel, holding a black-and-white sign bearing your last name. A simple pick-up and drop-off includes 15 minutes of courtesy wait.',
    image: '/images/airport.webp',
    position: '50% 40%',
    tags: ['Arrivals', 'Departures', 'Courtesy wait'],
    option: 'Airport transfer',
  },
  {
    id: 'corporate',
    no: '02',
    title: 'Corporate & executive',
    line: 'Your time is valuable. We respect it.',
    body: 'Black car service for executives, clients and teams, as well as corporate events. Flat or hourly rates are available, so a full day of meetings can be arranged as simply as a single transfer.',
    image: '/images/towers.webp',
    position: '50% 50%',
    tags: ['Black car', 'Executive', 'Corporate events'],
    option: 'Corporate / executive',
  },
  {
    id: 'conventions',
    no: '03',
    title: 'Conventions',
    line: 'Coordinated transportation for every session.',
    body: 'Corporate car service for conventions and conferences, where schedules can change by the hour. Share your itinerary with us and we will arrange for each guest to arrive at the right place on time.',
    image: '/images/conference.webp',
    position: '50% 40%',
    tags: ['Groups', 'Shuttling', 'Multi-day'],
    option: 'Convention',
  },
  {
    id: 'weddings',
    no: '04',
    title: 'Weddings & special occasions',
    line: 'Elegant arrivals for your most important day.',
    body: 'Transportation to the ceremony, between the ceremony and the reception, and home afterwards, so that no member of the wedding party needs to drive or park.',
    image: '/images/wedding.webp',
    position: '50% 55%',
    tags: ['Ceremony', 'Reception', 'Anniversaries'],
    option: 'Wedding / special occasion',
  },
  {
    id: 'nights-out',
    no: '05',
    title: 'Concerts, sports & nights out',
    line: 'Door-to-door service, in both directions.',
    body: 'Avoid parking and post-event traffic. Concerts, sporting events, dinners and evenings out are all well served by a reservation in both directions.',
    image: '/images/aerial-dusk.webp',
    position: '50% 55%',
    tags: ['Concerts', 'Sports', 'Dinners'],
    option: 'Concert, sports or night out',
  },
  {
    id: 'parties',
    no: '06',
    title: 'Prom, bachelor & bachelorette',
    line: 'Celebrations of every kind.',
    body: 'Prom, bachelor and bachelorette parties, birthdays and many other celebrations. Whatever the occasion, we provide a dependable chauffeur and a comfortable ride.',
    image: '/images/dusk-skyline.webp',
    position: '35% 50%',
    tags: ['Prom', 'Parties', 'Milestones'],
    option: 'Prom, bachelor / bachelorette',
  },
]

export const policies = [
  {
    id: 'pricing',
    title: 'Pricing',
    body: [
      'Please contact us for pricing.',
      'We offer flat or hourly rates, so tell us which fits the day and we will quote it before you commit.',
    ],
  },
  {
    id: 'airport',
    title: 'Airport pick-ups',
    body: [
      'The driver will be waiting at baggage claim level, at the bottom of the escalator nearest the appropriate luggage carousel.',
      'They will be holding a black-and-white sign with the passenger’s last name.',
    ],
  },
  {
    id: 'reservations',
    title: 'Reservations',
    body: [
      'Reservations are available seven days a week by phone, email or through this website.',
      'You can call or text 614-483-5876 at any hour.',
    ],
  },
  {
    id: 'wait',
    title: 'Wait time',
    body: [
      'A simple pick-up and drop-off includes 15 minutes of courtesy wait time.',
      'If your driver is waiting more than 15 minutes, an additional wait-time fee applies, calculated in 30-minute increments.',
    ],
  },
  {
    id: 'care',
    title: 'Care of the vehicle',
    body: [
      'Customers are liable for any damage they cause to our vehicles, including a $100 cleaning fee in some extreme cases.',
      'A cleaning fee of $200 up to $300, depending on severity and vehicle type, will be charged to the credit card on file.',
    ],
  },
]

export const fleetFacts = [
  { value: 6, suffix: '', label: 'Passengers per Suburban' },
  { value: 15, suffix: '', label: 'Minutes of courtesy wait' },
  { value: 24, suffix: '/7', label: 'Call or text line' },
  { value: 15, suffix: '+', label: 'Years in transportation' },
]

/** surnames cycled on the hero sign — a nod to the three languages the owner speaks */
export const signNames = ['Abebe', 'Petrov', 'Williams', 'Tadesse', 'Chen', 'Okafor']

export const regionsServed = [
  'Maryland',
  'District of Columbia',
  'Virginia',
  'Delaware',
  'Pennsylvania',
  'New York City',
]

export const languages = ['Russian', 'Amharic', 'Afaan Oromo']
