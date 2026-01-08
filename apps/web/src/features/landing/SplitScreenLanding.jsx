/**
 * TIER Golf Academy Landing Page
 * Premium hero section with app preview
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ChevronRight, Calendar, TrendingUp, Trophy } from 'lucide-react';
import { TIERGolfFullLogo } from '../../components/branding/TIERGolfFullLogo';

const navigation = [
  { name: 'Om oss', href: '#features' },
  { name: 'Funksjoner', href: '#features' },
  { name: 'For trenere', href: '#coaches' },
  { name: 'Kontakt', href: '#contact' },
];

export function SplitScreenLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleGetStarted = () => {
    navigate('/login?signup=true');
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <TIERGolfFullLogo height={40} variant="dark" />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Åpne meny</span>
              <Menu size={24} aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-tier-navy transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <button
              onClick={handleLogin}
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-tier-navy transition-colors"
            >
              Logg inn <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <>
            <div className="fixed inset-0 z-50 bg-black/20" onClick={() => setMobileMenuOpen(false)} />
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <a href="#" className="-m-1.5 p-1.5">
                  <TIERGolfFullLogo height={36} variant="dark" />
                </a>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                >
                  <span className="sr-only">Lukk meny</span>
                  <X size={24} aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                  <div className="py-6">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogin();
                      }}
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 w-full text-left"
                    >
                      Logg inn
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </header>

      {/* Hero section */}
      <div className="relative isolate pt-14">
        {/* Background pattern */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
        >
          <defs>
            <pattern
              x="50%"
              y={-1}
              id="hero-pattern"
              width={200}
              height={200}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
            <path
              d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect fill="url(#hero-pattern)" width="100%" height="100%" strokeWidth={0} />
        </svg>

        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-40">
          {/* Left content */}
          <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
            {/* Badge */}
            <div className="flex">
              <div className="relative flex items-center gap-x-4 rounded-full bg-white px-4 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                <span className="font-semibold text-tier-navy">Nyhet</span>
                <span aria-hidden="true" className="h-4 w-px bg-gray-900/10" />
                <a href="#features" className="flex items-center gap-x-1">
                  <span className="absolute inset-0" />
                  AI-drevet treningsanalyse
                  <ChevronRight size={16} className="-mr-2 text-gray-400" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Headline */}
            <h1 className="mt-10 text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl" style={{ textWrap: 'balance' }}>
              Utvikle ditt{' '}
              <span className="text-tier-navy">golfspill</span>{' '}
              systematisk
            </h1>

            {/* Description */}
            <p className="mt-8 text-lg font-medium text-gray-500 sm:text-xl leading-8" style={{ textWrap: 'pretty' }}>
              TIER Golf IUP gir deg verktøyene for å spore fremgang, følge treningsplaner og nå dine golfmål.
              Fra kategori D til A – vi er med deg hele veien.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex items-center gap-x-6">
              <button
                onClick={handleGetStarted}
                className="rounded-md bg-tier-navy px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-tier-navy-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tier-navy transition-colors"
              >
                Kom i gang
              </button>
              <a
                href="#features"
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-tier-navy transition-colors"
              >
                Les mer <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          {/* Right content - App mockup */}
          <div className="mt-16 sm:mt-24 lg:mt-0 lg:shrink-0 lg:grow">
            <svg role="img" viewBox="0 0 366 729" className="mx-auto w-[22.875rem] max-w-full drop-shadow-2xl">
              <title>App skjermbilde</title>
              <defs>
                <clipPath id="app-clip">
                  <rect rx={36} width={316} height={684} />
                </clipPath>
              </defs>
              {/* Phone frame - Black */}
              <path
                d="M363.315 64.213C363.315 22.99 341.312 1 300.092 1H66.751C25.53 1 3.528 22.99 3.528 64.213v44.68l-.857.143A2 2 0 0 0 1 111.009v24.611a2 2 0 0 0 1.671 1.973l.95.158a2.26 2.26 0 0 1-.093.236v26.173c.212.1.398.296.541.643l-1.398.233A2 2 0 0 0 1 167.009v47.611a2 2 0 0 0 1.671 1.973l1.368.228c-.139.319-.314.533-.511.653v16.637c.221.104.414.313.56.689l-1.417.236A2 2 0 0 0 1 237.009v47.611a2 2 0 0 0 1.671 1.973l1.347.225c-.135.294-.302.493-.49.607v377.681c0 41.213 22 63.208 63.223 63.208h95.074c.947-.504 2.717-.843 4.745-.843l.141.001h.194l.086-.001 33.704.005c1.849.043 3.442.37 4.323.838h95.074c41.222 0 63.223-21.999 63.223-63.212v-394.63c-.259-.275-.48-.796-.63-1.47l-.011-.133 1.655-.276A2 2 0 0 0 366 266.62v-77.611a2 2 0 0 0-1.671-1.973l-1.712-.285c.148-.839.396-1.491.698-1.811V64.213Z"
                fill="#1a1a1a"
              />
              <path
                d="M16 59c0-23.748 19.252-43 43-43h246c23.748 0 43 19.252 43 43v615c0 23.196-18.804 42-42 42H58c-23.196 0-42-18.804-42-42V59Z"
                fill="#0a0a0a"
              />
              {/* Dynamic Island */}
              <ellipse
                cx="183"
                cy="48"
                rx="54"
                ry="18"
                fill="#000000"
              />
              <foreignObject
                width={316}
                height={684}
                clipPath="url(#app-clip)"
                transform="translate(24 24)"
              >
                <div className="h-full w-full" style={{ background: 'linear-gradient(135deg, #f5f7f9 0%, #e8ecf0 100%)' }}>
                  {/* Header with TIER logo icon */}
                  <div className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm border-b border-gray-200/50">
                    <img
                      src="/tier-golf-icon.svg"
                      alt="TIER Golf"
                      style={{ width: '28px', height: '28px' }}
                    />
                    <div className="w-8 h-8 rounded-full bg-tier-navy/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-tier-navy">NL</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    {/* Player greeting */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-tier-navy to-tier-navy/80 flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-bold text-white">NL</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-[10px] text-gray-500 mb-0.5">Velkommen tilbake</div>
                          <div className="text-base font-bold text-tier-navy">Nils Jonas Lilja</div>
                          <div className="text-[10px] text-gray-500 mt-0.5">HCP 8.2 • Kategori B</div>
                        </div>
                      </div>
                    </div>

                    {/* SG Progression Card */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-semibold text-gray-900">SG Progresjon</div>
                        <div className="text-xs text-status-success font-medium">↗ +0.8</div>
                      </div>
                      <div className="relative h-24 mb-2">
                        <svg viewBox="0 0 280 90" className="w-full h-full">
                          <defs>
                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" style={{ stopColor: '#C9A227', stopOpacity: 0.2 }} />
                              <stop offset="100%" style={{ stopColor: '#C9A227', stopOpacity: 0.8 }} />
                            </linearGradient>
                          </defs>
                          <path
                            d="M 10 70 L 50 65 L 90 58 L 130 55 L 170 48 L 210 42 L 250 35 L 270 30"
                            fill="none"
                            stroke="url(#lineGradient)"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                          <circle cx="270" cy="30" r="4" fill="#C9A227" />
                        </svg>
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>Mai</span>
                      </div>
                    </div>

                    {/* Training Calendar */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                      <div className="text-sm font-semibold text-gray-900 mb-3">Treningsplan</div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 bg-tier-navy/5 rounded-lg">
                          <div className="w-1 h-8 bg-tier-gold rounded-full"></div>
                          <div className="flex-1">
                            <div className="text-xs font-medium text-tier-navy">I dag 14:00</div>
                            <div className="text-[11px] text-gray-600">Putting sesjon</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <div className="w-1 h-8 bg-gray-300 rounded-full"></div>
                          <div className="flex-1">
                            <div className="text-xs font-medium text-gray-700">I morgen 10:00</div>
                            <div className="text-[11px] text-gray-500">Driving range</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </foreignObject>
            </svg>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div id="features" className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-tier-navy">Alt du trenger</h2>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl" style={{ textWrap: 'balance' }}>
              Verktøy for systematisk golfutvikling
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Fra treningsplanlegging til fremgangsanalyse – TIER Golf IUP gir deg alt du trenger for å bli en bedre golfspiller.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {[
                {
                  name: 'Treningsplanlegging',
                  description: 'Personlige treningsplaner tilpasset ditt nivå og mål. Følg strukturerte programmer designet for å maksimere fremgangen.',
                  icon: <Calendar size={28} className="text-tier-navy" />,
                },
                {
                  name: 'Fremgangsanalyse',
                  description: 'Se din utvikling med tydelige statistikker og grafer. Spor alle aspekter av spillet ditt over tid.',
                  icon: <TrendingUp size={28} className="text-tier-navy" />,
                },
                {
                  name: 'Kategorisystem',
                  description: 'Tydelig nivåinndeling fra D til A med klare krav. Vet alltid hva som kreves for neste nivå.',
                  icon: <Trophy size={28} className="text-tier-gold" />,
                },
              ].map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    {feature.icon}
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-tier-navy">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl" style={{ textWrap: 'balance' }}>
              Klar for å ta golfspillet ditt til neste nivå?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-tier-navy-light/60">
              Bli med i TIER Golf og start din reise mot bedre golf i dag.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={handleGetStarted}
                className="rounded-md bg-white px-4 py-3 text-sm font-semibold text-tier-navy shadow-sm hover:bg-tier-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
              >
                Kom i gang gratis
              </button>
              <button
                onClick={handleLogin}
                className="text-sm font-semibold leading-6 text-white hover:text-tier-cream transition-colors"
              >
                Logg inn <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <TIERGolfFullLogo height={32} variant="dark" />
                <span className="text-sm text-gray-400">© 2025</span>
              </div>
              <div className="flex gap-6">
                <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Personvern</a>
                <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Vilkår</a>
              </div>
            </div>
            <div className="flex justify-center">
              <p className="text-xs text-gray-400 font-normal">Utviklet av TIER Golf</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default SplitScreenLanding;
