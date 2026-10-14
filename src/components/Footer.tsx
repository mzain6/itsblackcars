import { Link } from 'react-router-dom'
import { ArrowUp, MapPin, Phone } from 'lucide-react'
import { Logo } from './Logo'
import { business, nav } from '../data/site'

export function Footer() {
  return (
    <footer className="px-3 pb-3 pt-6 sm:px-4 sm:pb-4">
      <div className="overflow-hidden rounded-[1.75rem] bg-ink text-white sm:rounded-[2.5rem]">
        <div className="wrap pb-8 pt-14 sm:pt-20">
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Logo />
              <p className="mt-6 max-w-sm text-[1rem] leading-relaxed text-smoke">
                {business.legalName}. Corporate and private black car service across the Columbus area, in new
                Chevrolet Suburbans.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
              <div>
                <p className="mb-5 text-[0.82rem] font-semibold text-sage">Pages</p>
                <ul className="space-y-3">
                  {[...nav, { to: '/book', label: 'Book now' }].map((n) => (
                    <li key={n.to}>
                      <Link to={n.to} className="text-[1.02rem] text-white/80 transition-colors hover:text-white">
                        {n.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-5 text-[0.82rem] font-semibold text-sage">Call or text</p>
                <a href={business.phoneHref} className="block text-[1.6rem] font-medium tracking-[-0.03em] text-white">
                  {business.phone}
                </a>
                <p className="mt-3 flex items-start gap-2 text-[0.95rem] leading-relaxed text-smoke">
                  <Phone size={15} className="mt-1 shrink-0 text-sage" />
                  Answered 24/7. Reservations open seven days a week.
                </p>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <p className="mb-5 text-[0.82rem] font-semibold text-sage">Office</p>
                <a
                  href={business.mapsHref}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-2 text-[1.02rem] leading-relaxed text-white/80 transition-colors hover:text-white"
                >
                  <MapPin size={16} className="mt-1 shrink-0 text-sage" />
                  <span>
                    {business.street}
                    <br />
                    {business.cityLine}
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-6 text-[0.88rem] text-smoke sm:flex-row sm:items-center sm:justify-between">
            <p>
              &copy; {new Date().getFullYear()} {business.legalName}. All rights reserved.
            </p>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group flex items-center gap-2 self-start text-white/70 transition-colors hover:text-white sm:self-auto"
            >
              Back to top
              <ArrowUp size={15} className="transition-transform duration-300 group-hover:-translate-y-1" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
