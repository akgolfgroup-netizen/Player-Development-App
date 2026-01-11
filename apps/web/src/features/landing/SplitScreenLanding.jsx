/**
 * TIER Golf Landing Page
 * Premium hero section with multi-device app preview
 * MacBook Pro + iPhone + Apple Watch mockups
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ChevronRight, Calendar, TrendingUp, Trophy, Target, Zap } from 'lucide-react';
import { TIERGolfFullLogo } from '../../components/branding/TIERGolfFullLogo';
import { PageTitle, SectionTitle, SubSectionTitle, CardTitle } from '../../components/typography';

const navigation = [
  { name: 'Om oss', href: '#features' },
  { name: 'Funksjoner', href: '#features' },
  { name: 'For trenere', href: '#coaches' },
  { name: 'Kontakt', href: '#contact' },
];

// MacBook Pro Mockup Component
function MacBookMockup() {
  return (
    <div className="relative">
      {/* MacBook Screen */}
      <div className="relative mx-auto" style={{ width: '680px', maxWidth: '100%' }}>
        {/* Screen bezel */}
        <div className="bg-[#1a1a1a] rounded-t-xl pt-3 px-3 pb-0">
          {/* Camera notch */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#0a0a0a] border border-[#2a2a2a]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#1a3a5a]"></div>
          </div>

          {/* Screen content */}
          <div className="bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] rounded-t-lg overflow-hidden" style={{ aspectRatio: '16/10' }}>
            {/* App Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/tier-golf-icon.svg" alt="TIER" className="w-6 h-6" />
                <span className="text-sm font-semibold text-tier-navy">TIER Golf Analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-tier-navy/10 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-tier-navy">NL</span>
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-4 grid grid-cols-3 gap-3" style={{ height: 'calc(100% - 44px)' }}>
              {/* Left Column - Strokes Gained */}
              <div className="col-span-2 space-y-3">
                {/* SG Overview Card */}
                <div className="bg-white rounded-xl p-4 shadow-sm h-[45%]">
                  <div className="flex items-center justify-between mb-2">
                    <SubSectionTitle style={{ marginBottom: 0 }} className="text-sm font-semibold text-gray-900">Strokes Gained Analyse</SubSectionTitle>
                    <span className="text-[10px] px-2 py-0.5 bg-status-success/10 text-status-success rounded-full font-medium">+2.3 denne mnd</span>
                  </div>
                  <div className="flex items-end gap-4 h-[calc(100%-32px)]">
                    {/* Bar Chart */}
                    <div className="flex-1 flex items-end justify-around gap-2 h-full pb-4">
                      {[
                        { label: 'Tee', value: 65, color: '#0A2540' },
                        { label: 'Approach', value: 80, color: '#C9A227' },
                        { label: 'Short', value: 45, color: '#16A34A' },
                        { label: 'Putting', value: 70, color: '#2563EB' },
                      ].map((item) => (
                        <div key={item.label} className="flex flex-col items-center gap-1 flex-1">
                          <div
                            className="w-full rounded-t-md transition-all duration-500"
                            style={{ height: `${item.value}%`, backgroundColor: item.color, minHeight: '20px' }}
                          />
                          <span className="text-[8px] text-gray-500 font-medium">{item.label}</span>
                        </div>
                      ))}
                    </div>
                    {/* Stats */}
                    <div className="w-24 space-y-2">
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-tier-navy">+1.8</div>
                        <div className="text-[8px] text-gray-500">Total SG</div>
                      </div>
                      <div className="text-center p-2 bg-tier-gold/10 rounded-lg">
                        <div className="text-sm font-bold text-tier-gold">Top 15%</div>
                        <div className="text-[8px] text-gray-500">Kategori B</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trend Chart */}
                <div className="bg-white rounded-xl p-4 shadow-sm h-[45%]">
                  <div className="flex items-center justify-between mb-2">
                    <SubSectionTitle style={{ marginBottom: 0 }} className="text-sm font-semibold text-gray-900">Handicap Utvikling</SubSectionTitle>
                    <div className="flex gap-2">
                      <span className="text-[9px] px-2 py-0.5 bg-tier-navy text-white rounded font-medium">6 mnd</span>
                      <span className="text-[9px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded font-medium">1 år</span>
                    </div>
                  </div>
                  <svg viewBox="0 0 400 100" className="w-full h-[calc(100%-40px)]">
                    <defs>
                      <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#0A2540', stopOpacity: 0.3 }} />
                        <stop offset="100%" style={{ stopColor: '#0A2540', stopOpacity: 0 }} />
                      </linearGradient>
                    </defs>
                    {/* Area fill */}
                    <path
                      d="M 20 80 L 80 75 L 140 70 L 200 60 L 260 55 L 320 45 L 380 35 L 380 95 L 20 95 Z"
                      fill="url(#areaGradient)"
                    />
                    {/* Line */}
                    <path
                      d="M 20 80 L 80 75 L 140 70 L 200 60 L 260 55 L 320 45 L 380 35"
                      fill="none"
                      stroke="#0A2540"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Data points */}
                    <circle cx="380" cy="35" r="4" fill="#0A2540" />
                    <circle cx="380" cy="35" r="7" fill="#0A2540" fillOpacity="0.2" />
                    {/* Labels */}
                    <text x="20" y="95" fontSize="8" fill="#9ca3af">Aug</text>
                    <text x="120" y="95" fontSize="8" fill="#9ca3af">Okt</text>
                    <text x="220" y="95" fontSize="8" fill="#9ca3af">Des</text>
                    <text x="340" y="95" fontSize="8" fill="#9ca3af">Jan</text>
                    {/* HCP values */}
                    <text x="385" y="38" fontSize="9" fill="#0A2540" fontWeight="600">8.2</text>
                    <text x="5" y="83" fontSize="9" fill="#9ca3af">12.4</text>
                  </svg>
                </div>
              </div>

              {/* Right Column - Quick Stats */}
              <div className="space-y-3">
                {/* Player Card */}
                <div className="bg-gradient-to-br from-tier-navy to-tier-navy/90 rounded-xl p-3 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-xs font-bold">NL</span>
                    </div>
                    <div>
                      <div className="text-[10px] text-white/60">Spiller</div>
                      <div className="text-xs font-semibold">Nils Jonas</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="bg-white/10 rounded-lg p-2 text-center">
                      <div className="text-sm font-bold">8.2</div>
                      <div className="text-[8px] text-white/60">HCP</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2 text-center">
                      <div className="text-sm font-bold">B</div>
                      <div className="text-[8px] text-white/60">Kategori</div>
                    </div>
                  </div>
                </div>

                {/* Goals */}
                <div className="bg-white rounded-xl p-3 shadow-sm">
                  <CardTitle className="text-[10px] font-semibold text-gray-900 mb-2 flex items-center gap-1">
                    <Target size={10} className="text-tier-gold" />
                    Aktive mål
                  </CardTitle>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-tier-gold rounded-full" style={{ width: '75%' }} />
                      </div>
                      <span className="text-[8px] text-gray-500">75%</span>
                    </div>
                    <p className="text-[9px] text-gray-600">HCP under 8.0</p>
                  </div>
                </div>

                {/* Upcoming */}
                <div className="bg-white rounded-xl p-3 shadow-sm">
                  <CardTitle className="text-[10px] font-semibold text-gray-900 mb-2 flex items-center gap-1">
                    <Calendar size={10} className="text-tier-navy" />
                    Neste økt
                  </CardTitle>
                  <div className="bg-tier-navy/5 rounded-lg p-2">
                    <div className="text-[9px] font-medium text-tier-navy">I dag 14:00</div>
                    <div className="text-[8px] text-gray-500">Putting trening</div>
                  </div>
                </div>

                {/* Streak */}
                <div className="bg-gradient-to-br from-tier-gold/20 to-tier-gold/5 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <Zap size={14} className="text-tier-gold" />
                    <div>
                      <div className="text-sm font-bold text-tier-navy">12 dager</div>
                      <div className="text-[8px] text-gray-500">Treningsstreak</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MacBook Bottom (keyboard area hint) */}
        <div className="bg-gradient-to-b from-[#c4c4c4] to-[#a8a8a8] h-3 rounded-b-xl mx-1">
          <div className="h-0.5 bg-[#8a8a8a] mx-auto w-20 rounded-full mt-1"></div>
        </div>
        {/* Base */}
        <div className="bg-gradient-to-b from-[#e0e0e0] to-[#d0d0d0] h-2 rounded-b-lg mx-12 shadow-md"></div>
      </div>
    </div>
  );
}

// iPhone Mockup Component (refined)
function IPhoneMockup() {
  return (
    <svg role="img" viewBox="0 0 280 560" className="w-full max-w-[180px] drop-shadow-2xl">
      <title>iPhone App</title>
      <defs>
        <clipPath id="iphone-clip">
          <rect rx={28} width={244} height={524} />
        </clipPath>
      </defs>
      {/* Phone frame */}
      <path
        d="M279 50C279 22 259 2 231 2H49C21 2 1 22 1 50v460c0 28 20 48 48 48h182c28 0 48-20 48-48V50Z"
        fill="#1a1a1a"
      />
      <path
        d="M12 46c0-18 14-32 32-32h192c18 0 32 14 32 32v468c0 18-14 32-32 32H44c-18 0-32-14-32-32V46Z"
        fill="#0a0a0a"
      />
      {/* Dynamic Island */}
      <ellipse cx="140" cy="36" rx="42" ry="14" fill="#000" />

      <foreignObject
        width={244}
        height={524}
        clipPath="url(#iphone-clip)"
        transform="translate(18 18)"
      >
        <div className="h-full w-full" style={{ background: 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)' }}>
          {/* Status bar area */}
          <div className="h-12" />

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-white/80 backdrop-blur-sm">
            <img src="/tier-golf-icon.svg" alt="TIER" className="w-6 h-6" />
            <div className="w-7 h-7 rounded-full bg-tier-navy/10 flex items-center justify-center">
              <span className="text-[9px] font-bold text-tier-navy">NL</span>
            </div>
          </div>

          <div className="px-3 py-2 space-y-2">
            {/* Welcome Card */}
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-tier-navy to-tier-navy/80 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">NL</span>
                </div>
                <div>
                  <div className="text-[8px] text-gray-500">Velkommen tilbake</div>
                  <div className="text-sm font-bold text-tier-navy">Nils Jonas</div>
                  <div className="text-[8px] text-gray-500">HCP 8.2 • Kategori B</div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white rounded-xl p-3 shadow-sm text-center">
                <div className="text-lg font-bold text-tier-navy">+1.8</div>
                <div className="text-[8px] text-gray-500">Strokes Gained</div>
              </div>
              <div className="bg-gradient-to-br from-tier-gold/20 to-tier-gold/10 rounded-xl p-3 text-center">
                <div className="text-lg font-bold text-tier-navy">12</div>
                <div className="text-[8px] text-gray-500">Dager streak</div>
              </div>
            </div>

            {/* Today's Training */}
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <div className="text-[10px] font-semibold text-gray-900 mb-2">Dagens trening</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 p-2 bg-tier-navy/5 rounded-lg">
                  <div className="w-0.5 h-6 bg-tier-gold rounded-full"></div>
                  <div>
                    <div className="text-[9px] font-medium text-tier-navy">14:00 - Putting</div>
                    <div className="text-[8px] text-gray-500">45 min • 3 øvelser</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <div className="w-0.5 h-6 bg-gray-300 rounded-full"></div>
                  <div>
                    <div className="text-[9px] font-medium text-gray-700">16:30 - Driving</div>
                    <div className="text-[8px] text-gray-500">60 min • Range</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Ring */}
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="24" stroke="#e5e7eb" strokeWidth="4" fill="none" />
                    <circle
                      cx="28" cy="28" r="24"
                      stroke="#0A2540" strokeWidth="4" fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${0.75 * 151} 151`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-tier-navy">75%</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-gray-900">Ukesmål</div>
                  <div className="text-[8px] text-gray-500">3 av 4 økter fullført</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </foreignObject>
    </svg>
  );
}

// Apple Watch Mockup Component
function AppleWatchMockup() {
  return (
    <div className="relative">
      <svg viewBox="0 0 160 200" className="w-full max-w-[100px] drop-shadow-xl">
        {/* Watch case */}
        <rect x="20" y="30" width="120" height="140" rx="28" fill="#1a1a1a" />
        <rect x="26" y="36" width="108" height="128" rx="22" fill="#0a0a0a" />

        {/* Crown */}
        <rect x="140" y="70" width="8" height="24" rx="4" fill="#2a2a2a" />
        <rect x="140" y="105" width="8" height="12" rx="4" fill="#2a2a2a" />

        {/* Band hints */}
        <rect x="45" y="5" width="70" height="28" rx="8" fill="#2a2a2a" />
        <rect x="45" y="167" width="70" height="28" rx="8" fill="#2a2a2a" />

        {/* Screen */}
        <foreignObject x="32" y="42" width="96" height="116" style={{ borderRadius: '18px', overflow: 'hidden' }}>
          <div className="h-full w-full bg-black rounded-[18px] overflow-hidden p-2">
            {/* Watch face content - Training reminder */}
            <div className="h-full flex flex-col justify-between">
              {/* Time */}
              <div className="text-center">
                <div className="text-[10px] text-white/60">TIER Golf</div>
                <div className="text-2xl font-light text-white tracking-tight">13:45</div>
              </div>

              {/* Training reminder */}
              <div className="bg-tier-gold/20 rounded-xl p-2 text-center">
                <div className="text-[8px] text-tier-gold font-medium">NESTE ØKT</div>
                <div className="text-xs text-white font-semibold mt-0.5">Putting</div>
                <div className="text-[10px] text-white/80">om 15 min</div>
              </div>

              {/* Quick stats */}
              <div className="flex justify-around">
                <div className="text-center">
                  <div className="text-sm font-bold text-tier-green">12</div>
                  <div className="text-[7px] text-white/50">STREAK</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-tier-gold">3/4</div>
                  <div className="text-[7px] text-white/50">ØKTER</div>
                </div>
              </div>
            </div>
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}

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
      <div className="relative isolate pt-14 overflow-hidden">
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

        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-white to-transparent -z-10" />

        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
          {/* Top section - Text content */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            {/* Badge */}
            <div className="flex justify-center mb-8">
              <div className="relative flex items-center gap-x-4 rounded-full bg-white px-4 py-1.5 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20 shadow-sm">
                <span className="font-semibold text-tier-navy">Nyhet</span>
                <span aria-hidden="true" className="h-4 w-px bg-gray-900/10" />
                <a href="#features" className="flex items-center gap-x-1">
                  <span className="absolute inset-0" />
                  Tilgjengelig på alle enheter
                  <ChevronRight size={16} className="-mr-2 text-gray-400" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Headline */}
            <PageTitle style={{ marginBottom: 0, textWrap: 'balance' }} className="text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
              Utvikle ditt{' '}
              <span className="text-tier-navy">golfspill</span>{' '}
              systematisk
            </PageTitle>

            {/* Description */}
            <p className="mt-8 text-lg font-medium text-gray-500 sm:text-xl leading-8 max-w-2xl mx-auto" style={{ textWrap: 'pretty' }}>
              TIER Golf IUP gir deg verktøyene for å spore fremgang, følge treningsplaner og nå dine golfmål.
              Fra kategori D til A – på Mac, iPhone og Apple Watch.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={handleGetStarted}
                className="rounded-xl bg-tier-navy px-6 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-tier-navy-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tier-navy transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                Kom i gang gratis
              </button>
              <a
                href="#features"
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-tier-navy transition-colors"
              >
                Se funksjoner <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          {/* Device Showcase */}
          <div className="relative max-w-6xl mx-auto">
            {/* MacBook - Center */}
            <div className="relative z-10">
              <MacBookMockup />
            </div>

            {/* iPhone - Left side, overlapping MacBook */}
            <div className="absolute -left-4 lg:left-8 bottom-0 z-20 transform translate-y-8">
              <IPhoneMockup />
            </div>

            {/* Apple Watch - Right side */}
            <div className="absolute -right-2 lg:right-16 bottom-16 z-20">
              <AppleWatchMockup />
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-tier-gold/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-tier-navy/10 rounded-full blur-3xl -z-10" />
          </div>

          {/* Platform badges */}
          <div className="flex items-center justify-center gap-8 mt-16">
            <div className="flex items-center gap-2 text-gray-500">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span className="text-sm font-medium">macOS</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span className="text-sm font-medium">iOS</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span className="text-sm font-medium">watchOS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div id="features" className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <SectionTitle style={{ marginBottom: 0 }} className="text-base font-semibold leading-7 text-tier-navy">Alt du trenger</SectionTitle>
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
            <SectionTitle style={{ marginBottom: 0, textWrap: 'balance' }} className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Klar for å ta golfspillet ditt til neste nivå?
            </SectionTitle>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-tier-navy-light/60">
              Bli med i TIER Golf og start din reise mot bedre golf i dag.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={handleGetStarted}
                className="rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-tier-navy shadow-lg hover:bg-tier-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all hover:shadow-xl"
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
