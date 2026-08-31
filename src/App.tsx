import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'
import emailjs from '@emailjs/browser'
import giftOfTimeImage from './assets/gift-of-time.jpg'
import portraitImage from './assets/honore-portrait.jpg'
import romeoJulietImage from './assets/romeo-juliet.jpg'
import stagePortraitImage from './assets/stage-portrait.jpg'
import ensembleImage from './assets/ubumuntu-ensemble.jpg'
import ThreeScrollHero from './components/ThreeScrollHero'
import InstagramReel from './components/embed'

type PageMeta = {
  title: string
  description: string
}

const metaByPath: Record<string, PageMeta> = {
  '/': {
    title: 'Honore Hartel — Dance Artist, Choreographer, Teacher & Actor',
    description:
      'Honore Hartel is a Kigali-based dance artist, choreographer, teacher, actor, and creator of the KIMO movement language.',
  },
  '/portfolio/': {
    title: 'Performance — Honore Hartel',
    description:
      'Selected international and Rwandan performance work by Honore Hartel, including Romeo / Juliet — Paradise and Gift of Time.',
  },
  '/portfolio/performance/': {
    title: 'Performance — Honore Hartel',
    description:
      'Selected international and Rwandan performance work by Honore Hartel, including Romeo / Juliet — Paradise and Gift of Time.',
  },
  '/portfolio/teaching/': {
    title: 'Teaching — Honore Hartel',
    description:
      'Honore Hartel’s teaching journey through classes, workshops, and movement practice in Rwanda and internationally.',
  },
  '/portfolio/film-screen/': {
    title: 'Film & Screen — Honore Hartel',
    description:
      'Film, acting, and movement-for-camera work by Honore Hartel, including the short film Untold Story.',
  },
  '/classes/': {
    title: 'Classes at Home of Dance — Honore Hartel',
    description:
      'Book Afro Fusion, children’s dance, and guest workshops with Honore Hartel and Home of Dance in Kigali.',
  },
  '/contact/': {
    title: 'Contact — Honore Hartel',
    description:
      'Let’s work together. Send Honore Hartel a message about a project, class, performance, or collaboration.',
  },
  '/press/': {
    title: 'Press — Honore Hartel',
    description:
      'Press features and media coverage of Rwandan dance artist Honore Hartel.',
  },
}

function normalizePath(path: string) {
  const clean = path.split('?')[0].split('#')[0]
  if (!clean || clean === '/') return '/'
  return `/${clean.replace(/^\/+|\/+$/g, '')}/`
}

function getPageMeta(path: string): PageMeta {
  const normalized = normalizePath(path)
  return (
    metaByPath[normalized] ?? {
      title: 'Page not found — Honore Hartel',
      description: 'Return to the official website of Honore Hartel.',
    }
  )
}

const portfolioLinks = [
  { label: 'Performance', href: '/portfolio/performance/' },
  { label: 'Teaching', href: '/portfolio/teaching/' },
  { label: 'Film & Screen', href: '/portfolio/film-screen/' },
]

const performanceWorks = [
  {
    title: 'Romeo / Juliet — Paradise',
    year: '2026',
    place: 'Germany',
    role: 'Lead performer · Romeo',
    description:
      'A German–Rwandan contemporary reimagining of Shakespeare, performed across Görlitz, Cottbus, and Bautzen.',
    image: romeoJulietImage,
    width: 1800,
    height: 1200,
    alt: 'Honore Hartel performing in Romeo / Juliet — Paradise under a stage spotlight',
    href: 'https://youtu.be/loTygOn0Xbs?si=wyqDkoZjcLgZ0Yr2',
  },
  {
    title: 'Gift of Time',
    year: '2024',
    place: 'Kigali, Rwanda',
    role: 'Performer · Choreography transmission',
    description:
      'A 100-dancer commemorative work for Kwibuka30, tracing Rwanda’s journey through loss, resilience, and transformation.',
    image: giftOfTimeImage,
    width: 1800,
    height: 1200,
    alt: 'A large dance ensemble performing Gift of Time on stage',
    href: 'https://www.youtube.com/watch?v=0_AMzkaXCs0',
  },
  {
    title: 'Rhymes of Remembrance',
    year: '2025',
    place: 'Kigali, Rwanda',
    role: 'Performer',
    description:
      'Poetry, testimony, and sound translated into movement for Kwibuka31.',
    image: stagePortraitImage,
    width: 1800,
    height: 1199,
    alt: 'Honore Hartel and fellow performers together on stage',
    href: 'https://www.youtube.com/watch?v=zObtKvHdBLU',
  },
  {
    title: 'The We in Me',
    year: '2025',
    place: 'Ubumuntu Arts Festival',
    role: 'Performer',
    description:
      'An ensemble performance presented at Ubumuntu Arts Festival in Kigali.',
    image: ensembleImage,
    width: 1800,
    height: 1200,
    alt: 'A contemporary dance ensemble performing in warm stage light',
  },
]

const performanceCredits = [
  ['Dear Children, Sincerely…', 'Actor & dancer', 'Sri Lanka · UAE', '2025'],
  ['Fragility', 'Performer', 'Kigali, Rwanda', '2025'],
  ['Rebirth', 'Choreographer & performer', 'Kigali, Rwanda', '2025'],
  ['Metamorphosis', 'Co-choreographer & performer', 'Kigali, Rwanda', '2024'],
]

const emailJsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim() ?? ''
const emailJsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim() ?? ''
const emailJsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID?.trim() ?? ''

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14m-5-5 5 5-5 5" />
    </svg>
  )
}

function ChevronDown() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m7 9 5 5 5-5" />
    </svg>
  )
}

function MenuIcon({ open }: { open: boolean }) {
  return open ? (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 8h16M4 16h16" />
    </svg>
  )
}

function SiteHeader({ currentPath }: { currentPath: string }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [portfolioOpen, setPortfolioOpen] = useState(false)
  const isPortfolio = currentPath.startsWith('/portfolio/')

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        setPortfolioOpen(false)
      }
    }

    document.body.classList.toggle('menu-is-open', menuOpen)
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.classList.remove('menu-is-open')
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [menuOpen])

  const closeMenu = () => {
    setMenuOpen(false)
    setPortfolioOpen(false)
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="/" aria-label="Honore Hartel — home">
          Honore Hartel
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="/#about">About</a>
          <div
            className={`nav-portfolio${portfolioOpen ? ' is-open' : ''}`}
            onMouseLeave={() => setPortfolioOpen(false)}
          >
            <span className="nav-portfolio-trigger">
              <a
                href="/portfolio/performance/"
                aria-current={isPortfolio ? 'page' : undefined}
                onFocus={() => setPortfolioOpen(true)}
              >
                Portfolio
              </a>
              <button
                type="button"
                aria-label="Open portfolio menu"
                aria-expanded={portfolioOpen}
                onClick={() => setPortfolioOpen((open) => !open)}
              >
                <ChevronDown />
              </button>
            </span>
            <div className="portfolio-dropdown">
              {portfolioLinks.map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label}
                  <ArrowUpRight />
                </a>
              ))}
            </div>
          </div>
          <a
            href="/classes/"
            aria-current={currentPath === '/classes/' ? 'page' : undefined}
          >
            Classes
          </a>
          <a
            href="/press/"
            aria-current={currentPath === '/press/' ? 'page' : undefined}
          >
            Press
          </a>
          <a
            href="/contact/"
            aria-current={currentPath === '/contact/' ? 'page' : undefined}
          >
            Contact
          </a>
        </nav>

        <a className="header-cta" href="/contact/">
          Get in touch
          <ArrowUpRight />
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <MenuIcon open={menuOpen} />
        </button>
      </div>

      <nav
        className={`mobile-nav${menuOpen ? ' is-open' : ''}`}
        id="mobile-navigation"
        aria-label="Mobile navigation"
      >
        <a href="/#about" onClick={closeMenu}>
          About
        </a>
        <details open={portfolioOpen}>
          <summary onClick={() => setPortfolioOpen((open) => !open)}>
            Portfolio
            <ChevronDown />
          </summary>
          <div>
            {portfolioLinks.map((item) => (
              <a href={item.href} key={item.href} onClick={closeMenu}>
                {item.label}
              </a>
            ))}
          </div>
        </details>
        <a href="/classes/" onClick={closeMenu}>
          Classes
        </a>
        <a href="/press/" onClick={closeMenu}>
          Press
        </a>
        <a href="/contact/" onClick={closeMenu}>
          Contact
        </a>
        <a className="mobile-contact" href="/contact/" onClick={closeMenu}>
          Get in touch
          <ArrowUpRight />
        </a>
      </nav>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-cta">
        <h2>Interested in working with Honore?</h2>
        <a className="footer-cta-button" href="/contact/">
          Start here
        </a>
      </div>
      <nav className="footer-links" aria-label="Social and project links">
        <a
          href="https://www.youtube.com/@honore_hartel"
          target="_blank"
          rel="noreferrer"
        >
          YouTube
        </a>
        <a
          href="https://www.instagram.com/honore_hartel/"
          target="_blank"
          rel="noreferrer"
        >
          Instagram
        </a>
        <a
          href="https://www.facebook.com/share/16T2CtvCwf/?mibextid=wwXIfr"
          target="_blank"
          rel="noreferrer"
        >
          Facebook
        </a>
        <a
          href="https://www.instagram.com/home.ofdance?igsh=MTNvazk1OW4yNmJoMg=="
          target="_blank"
          rel="noreferrer"
        >
          Home of Dance
        </a>
      </nav>
      <p className="footer-copyright">
        © {new Date().getFullYear()} Honore Hartel. All rights reserved.
      </p>
    </footer>
  )
}

function PageShell({
  currentPath,
  children,
}: {
  currentPath: string
  children: ReactNode
}) {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader currentPath={currentPath} />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </div>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="section-label">{children}</p>
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="11" />
      <path d="M16 9.5v7l4.5 2.5" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="11" />
      <path d="M5 16h22M16 5c3.3 3.1 5 6.8 5 11s-1.7 7.9-5 11c-3.3-3.1-5-6.8-5-11s1.7-7.9 5-11Z" />
    </svg>
  )
}

function StudentsIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="11" r="4" />
      <circle cx="7.5" cy="14" r="3" />
      <circle cx="24.5" cy="14" r="3" />
      <path d="M9.5 25v-2.2c0-3.7 2.9-6.8 6.5-6.8s6.5 3.1 6.5 6.8V25M3.5 24v-1.4c0-2.8 1.8-5.2 4.5-5.6M28.5 24v-1.4c0-2.8-1.8-5.2-4.5-5.6" />
    </svg>
  )
}

function Stat({
  value,
  suffix,
  label,
  icon,
}: {
  value: number
  suffix?: string
  label: string
  icon: ReactNode
}) {
  const [display, setDisplay] = useState(value)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    let frame = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        const start = performance.now()
        const duration = 1100
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setDisplay(Math.round(value * eased))
          if (progress < 1) frame = requestAnimationFrame(tick)
        }
        setDisplay(0)
        frame = requestAnimationFrame(tick)
        observer.disconnect()
      },
      { threshold: 0.5 },
    )

    observer.observe(element)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value])

  return (
    <div className="stat" ref={ref}>
      <span className="stat-icon">{icon}</span>
      <strong>
        {display}
        {suffix}
      </strong>
      <span>{label}</span>
    </div>
  )
}

function HomePage() {
  return (
    <>
      <ThreeScrollHero />

      <section className="about section" id="about" aria-labelledby="about-title">
        <div className="section-inner">
          <div className="about-grid">
            <div className="about-copy">
              <h2 id="about-title">Meet Honore</h2>
              <p>
                Honore MANZI MURENGEZI, known as Honore Hartel, is a dance
                artist, choreographer, teacher, and actor based in Kigali. His
                work moves across performance, choreography, film, and
                teaching, from intimate theatre productions to large
                commemorative works, and from Kigali to stages in Germany, the
                UAE, and Sri Lanka.
              </p>
              <p>
                He is the founder of Home of Dance and the creator of KIMO, a
                movement language rooted in Rwandan tradition and open to the
                contemporary world. Across everything he does, his focus stays
                the same: using movement to carry culture, tell stories, and
                connect people.
              </p>
              <a className="text-link" href="/portfolio/performance/">
                View portfolio <ArrowRight />
              </a>
            </div>
            <figure className="about-portrait">
              <img
                src={portraitImage}
                alt="Portrait of Honore Hartel in Kigali"
                // width="1440"
                // height="1800"
                loading="lazy"
              />
              <figcaption>Kigali, Rwanda · Working worldwide</figcaption>
            </figure>
          </div>
          <div className="stats-grid" aria-label="Career highlights">
            <Stat value={4} suffix="+" label="Years of experience" icon={<ClockIcon />} />
            <Stat value={4} label="Countries" icon={<GlobeIcon />} />
            <Stat value={200} suffix="+" label="Students taught" icon={<StudentsIcon />} />
          </div>
        </div>
      </section>

      <section className="kimo section" id="kimo" aria-labelledby="kimo-title">
        <div className="section-inner">
          <div className="kimo-heading">
            <h2 id="kimo-title">KIMO Dance Style</h2>
            <p>Where Rwandan tradition meets modern dance styles</p>
          </div>
          <div className="kimo-copy">
            <div className="video-embed kimo-video">
              <iframe
                src="https://www.youtube-nocookie.com/embed/2_JvU2gDASI"
                title="KIMO Dance Style by Honore Hartel"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                loading="lazy"
              />
            </div>
            <div>
              <p className="pb-10 !leading-8">
                KIMO is a dynamic dance style born from the fusion of Rwandan
                traditional dance and modern influences — a vibrant form that
                celebrates Rwanda's rich cultural heritage while embracing
                contemporary creativity.
              </p>
              <p className="pt-5 !leading-8">
                Inspired by the depth of Kinyarwanda, KIMO seamlessly blends
                traditional movement with modern elements, offering a captivating
                experience that showcases the beauty and diversity of Rwandan
                dance on a global stage. Through KIMO, I aim to bridge tradition
                and modernity, sharing the cultural significance of Rwandan dance
                with audiences worldwide.
              </p>
            </div>

          </div>

        </div>
      </section>
    </>
  )
}

function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children?: ReactNode
}) {
  return (
    <header className="page-intro">
      <div className="section-inner">
        <SectionLabel>{eyebrow}</SectionLabel>
        <h1>{title}</h1>
        {children && <div className="page-intro-copy">{children}</div>}
      </div>
    </header>
  )
}

type PerformanceWork = (typeof performanceWorks)[number]

function WorkCard({ work, featured = false }: { work: PerformanceWork; featured?: boolean }) {
  const media = (
    <img
      src={work.image}
      alt={work.alt}
      width={work.width}
      height={work.height}
      loading={featured ? 'eager' : 'lazy'}
    />
  )

  return (
    <article className={`work-card${featured ? ' work-card--featured' : ''}`}>
      {work.href ? (
        <a
          className="work-media"
          href={work.href}
          target="_blank"
          rel="noreferrer"
          aria-label={`Watch ${work.title}`}
        >
          {media}
          <span className="play-link">Watch <ArrowUpRight /></span>
        </a>
      ) : (
        <figure className="work-media">{media}</figure>
      )}
      <div className="work-copy">
        <div className="work-meta">
          <span>{work.year}</span>
          <span>{work.place}</span>
        </div>
        <h2>{work.title}</h2>
        <p className="work-role">{work.role}</p>
        <p>{work.description}</p>
      </div>
    </article>
  )
}

function PerformancePage() {
  return (
    <>
      <PageIntro eyebrow="Portfolio" title="Performance">
        <p>Selected stage and choreographic work.</p>
      </PageIntro>
      <section className="performance section" aria-label="Featured performances">
        <div className="section-inner featured-work-grid">
          {performanceWorks.slice(0, 2).map((work) => (
            <WorkCard work={work} featured key={work.title} />
          ))}
        </div>
        <details className="more-work section-inner">
          <summary>
            <span>See more</span>
            <span className="summary-icon" aria-hidden="true">+</span>
          </summary>
          <div className="more-work-grid">
            {performanceWorks.slice(2).map((work) => (
              <WorkCard work={work} key={work.title} />
            ))}
          </div>
          <div className="credits-table" aria-label="Additional performance credits">
            <h2>Additional credits</h2>
            {performanceCredits.map(([title, role, place, year]) => (
              <div className="credit-row" key={title}>
                <h3>{title}</h3>
                <p>{role}</p>
                <p>{place}</p>
                <time>{year}</time>
              </div>
            ))}
          </div>
        </details>
      </section>
      <NextPage href="/portfolio/teaching/" label="Next" title="Teaching" />
    </>
  )
}

function TeachingPage() {
  return (
    <>
      <PageIntro eyebrow="Portfolio" title="Teaching">
        <p>A teaching practice shaped by movement, exchange, and care.</p>
      </PageIntro>
      <section className="teaching-journey section" aria-labelledby="teaching-journey-title">
        <div className="section-inner teaching-journey-grid">
          <div className="teaching-copy">
            <SectionLabel>Teaching journey</SectionLabel>
            <h2 id="teaching-journey-title">Movement is something we share.</h2>
            <p>
              Honore’s teaching has grown alongside his work as a performer,
              from regular classes in Kigali to workshops for children,
              emerging dancers, and professional artists. His sessions draw on
              Rwandan traditional movement, Afro Fusion, hip hop, dancehall,
              and contemporary practice.
            </p>
            <p>
              The aim is not to make every body move in the same way. It is to
              build confidence, musicality, discipline, and the freedom to find
              a movement language of your own.
            </p>
          </div>
          <div className="teaching-reel">
            <div className="instagram-video">
              {/* <InstagramReel/> */}
              <iframe
                src="https://www.instagram.com/reel/DWgZhyqDAXw/embed/"
                title="Honore Hartel teaching an international dance class"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>
            <a
              className="media-external-link"
              href="https://www.instagram.com/reel/DWgZhyqDAXw/"
              target="_blank"
              rel="noreferrer"
            >
              Teaching reel · Watch on Instagram <ArrowUpRight />
            </a>
          </div>
        </div>
      </section>
      <section className="teaching-numbers" aria-label="Teaching highlights">
        <div className="section-inner teaching-number-grid">
          <div><strong>6+</strong><span>Workshops given</span></div>
          <div><strong>25+</strong><span>Classes</span></div>
          <div><strong>200+</strong><span>Students taught</span></div>
        </div>
      </section>
      <NextPage href="/portfolio/film-screen/" label="Next" title="Film & Screen" />
    </>
  )
}

function FilmScreenPage() {
  const films = [
    {
      title: 'Untold Story',
      year: '2025',
      role: 'Actor · Dancer · Creative',
      description:
        'An intimate short film about the silent battles dancers carry beyond the glow of the stage, created with Kiseki Films.',
      videoId: 'Wo2TUVKasP0',
    },
    {
      title: 'Where Am I Going?',
      year: '2026',
      role: 'Short film',
      description:
        'A movement-led short film from Honore Hartel, created for the screen.',
      videoId: 'xEiYcVraQ6o',
    },
  ]

  return (
    <>
      <PageIntro eyebrow="Portfolio" title="Film & Screen">
        <p>Acting, dance, and movement for camera.</p>
      </PageIntro>
      <section className="film-feature section">
        <div className="section-inner film-card-grid">
          {films.map((film) => (
            <article className="film-card" key={film.videoId}>
              <div className="video-embed film-video">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${film.videoId}`}
                  title={`${film.title} — short film by Honore Hartel`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <div className="film-copy">
                <div className="work-meta"><span>{film.year}</span><span>Short film</span></div>
                <h2>{film.title}</h2>
                <p className="work-role">{film.role}</p>
                <p>{film.description}</p>
                <a
                  className="text-link"
                  href={`https://www.youtube.com/watch?v=${film.videoId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Watch on YouTube <ArrowUpRight />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
      <NextPage href="/contact/" label="For screen and acting enquiries" title="Get in touch" />
    </>
  )
}

function ContactForm({
  defaultService = '',
  compact = false,
}: {
  defaultService?: string
  compact?: boolean
}) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget

    if (!emailJsPublicKey || !emailJsServiceId || !emailJsTemplateId) {
      setStatus('error')
      setStatusMessage(
        'Email delivery is being connected. Please use the email or phone details shown here for now.',
      )
      return
    }

    const honeypot = new FormData(form).get('_gotcha')
    if (typeof honeypot === 'string' && honeypot.trim()) {
      form.reset()
      setStatus('success')
      setStatusMessage('Thank you. Your message has been received.')
      return
    }

    setStatus('submitting')
    setStatusMessage('Sending your message…')

    try {
      await emailjs.sendForm(emailJsServiceId, emailJsTemplateId, form, {
        publicKey: emailJsPublicKey,
        blockHeadless: true,
        limitRate: {
          id: compact ? 'honore-class-booking' : 'honore-contact',
          throttle: 10_000,
        },
      })
      form.reset()
      setStatus('success')
      setStatusMessage('Thank you. Your message has been sent to Honore.')
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('EmailJS submission failed.', error)
      }
      setStatus('error')
      setStatusMessage('Your message could not be sent. Please try again in a moment.')
    }
  }

  return (
    <form
      className={`contact-form${compact ? ' contact-form--compact' : ''}`}
      id={compact ? 'class-booking-form' : 'contact-form'}
      onSubmit={handleSubmit}
      aria-busy={status === 'submitting'}
    >
      <input
        type="hidden"
        name="subject"
        value={
          compact
            ? 'New class booking request — Honore Hartel'
            : 'New website enquiry — Honore Hartel'
        }
      />
      <input
        type="hidden"
        name="form_type"
        value={compact ? 'Class booking' : 'General enquiry'}
      />
      <label className="honeypot" aria-hidden="true">
        Leave this field empty
        <input name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
      </label>
      <div className="form-row">
        <label>
          Name
          <input name="name" type="text" autoComplete="name" required />
        </label>
        <label>
          Email
          <input name="email" type="email" autoComplete="email" required />
        </label>
      </div>
      <div className="form-row">
        <label>
          Enquiry
          <select name="service" defaultValue={defaultService} required>
            <option value="" disabled>Choose one</option>
            <option>Performance</option>
            <option>Choreography</option>
            <option>Class booking</option>
            <option>Workshop</option>
            <option>Film / acting</option>
            <option>Creative collaboration</option>
            <option>Other</option>
          </select>
        </label>
        <label>
          Preferred date
          <input name="date" type="date" />
        </label>
      </div>
      <label>
        City / venue
        <input name="location" type="text" />
      </label>
      <label>
        Message
        <textarea
          name="message"
          rows={compact ? 4 : 6}
          placeholder={
            compact
              ? 'Class, age or level, and anything we should know.'
              : 'Tell Honore about the project, timing, audience, or idea.'
          }
          required
        />
      </label>
      <button className="form-submit" type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : compact ? 'Request a class' : 'Send message'}
        {status !== 'submitting' && <ArrowRight />}
      </button>
      <p className={`form-status form-status--${status}`} role="status" aria-live="polite">
        {statusMessage || 'Your details are used only to reply to this enquiry.'}
      </p>
    </form>
  )
}

function ClassesPage() {
  return (
    <>
      <PageIntro eyebrow="Classes" title="Home of Dance" />
      <section className="classes-overview section" aria-labelledby="home-of-dance-story">
        <div className="section-inner classes-story-grid">
          <div className="classes-copy">
            <h2 id="home-of-dance-story">A growing dance community in Kigali.</h2>
            <p>
              Home of Dance is a dance teaching and collaborative platform
              based in Kigali, not just a place to learn, but a growing
              community where dancers, teachers, and creatives come together.
              It runs weekly classes in Afro Fusion and Afro Hip Hop for
              children, alongside pop-up workshops with local and visiting
              artists. Whether you're stepping into a class for the first time
              or deepening a lifelong practice, there's a space for you here.
            </p>
            <p>
              Since 2024, Home of Dance has welcomed 200+ students and hosted
              guest teachers across many styles, and it keeps growing, building
              toward a permanent studio: a lasting home for dance in Rwanda.
            </p>
          </div>
          <div className="classes-video-block">
            <div className="home-of-dance-video">
              <iframe
                src="https://www.instagram.com/reel/DbbVwe3OjEb/embed/"
                title="Home of Dance Season 2 class highlights"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>
            <a
              className="media-external-link"
              href="https://www.instagram.com/reel/DbbVwe3OjEb/"
              target="_blank"
              rel="noreferrer"
            >
              Season 2 highlights · Watch on Instagram <ArrowUpRight />
            </a>
          </div>
        </div>
      </section>
      <section className="booking-paths section" aria-labelledby="booking-paths-title">
        <div className="section-inner">
          <SectionLabel>Booking</SectionLabel>
          <h2 id="booking-paths-title">Choose how you want to dance.</h2>
          <div className="booking-path-grid">
            <article>
              <span>01</span>
              <h3>Weekly classes</h3>
              <p>Join the regular Afro Fusion and kids' Afro Hip Hop classes.</p>
              <a
                className="button button--dark"
                href="https://homeofdance.sinc.events/"
                target="_blank"
                rel="noreferrer"
              >
                Book via Sinc <ArrowUpRight />
              </a>
            </article>
            <article>
              <span>02</span>
              <h3>Private classes &amp; events</h3>
              <p>Request a private session, a group class, or dance for your event.</p>
              <a className="button button--line" href="#class-booking-form">
                Request here <ArrowRight />
              </a>
            </article>
          </div>
        </div>
      </section>
      <section
        className="class-booking section"
        id="class-booking-form"
        aria-labelledby="class-booking-title"
      >
        <div className="section-inner booking-grid">
          <div>
            <SectionLabel>Private &amp; events</SectionLabel>
            <h2 id="class-booking-title">Tell us what you have in mind.</h2>
            <p>
              Share the group, occasion, location, and date. Home of Dance will
              reply with the right format for you.
            </p>
          </div>
          <ContactForm defaultService="Private class or event" compact />
        </div>
      </section>
    </>
  )
}

function ContactPage() {
  return (
    <>
      <PageIntro eyebrow="Contact" title="Let’s work together" />
      <section className="contact-section section">
        <div className="section-inner contact-grid">
          <aside className="contact-details">
            <SectionLabel>Direct</SectionLabel>
            <a href="mailto:manzihonore1@gmail.com">
              <span>Email</span>
              manzihonore1@gmail.com
            </a>
            <a href="tel:+250788634358">
              <span>Phone</span>
              +250 788 634 358
            </a>
            <p><span>Based in</span>Kigali, Rwanda · Available worldwide</p>
          </aside>
          <ContactForm />
        </div>
      </section>
    </>
  )
}

function PressPage() {
  const press = [
    {
      source: 'Deutsche Welle',
      title: 'How tradition moves forward in Rwanda',
      type: 'Video feature · 2026',
      href: 'https://www.dw.com/en/how-tradition-moves-forward-in-rwanda/video-76792121',
    },
    {
      source: 'The New Times Rwanda',
      title: 'How dance can become a money-making career',
      type: 'Profile · 2022',
      href: 'https://www.newtimes.co.rw/article/1210/lifestyle/people/local-performer-on-how-dance-can-be-a-money-making-career',
    },
  ]

  return (
    <>
      <PageIntro eyebrow="Media" title="Press">
        <p>Interviews and features.</p>
      </PageIntro>
      <section className="press section">
        <div className="section-inner press-list">
          {press.map((item) => (
            <a href={item.href} target="_blank" rel="noreferrer" className="press-item" key={item.href}>
              <span>{item.source}</span>
              <h2>{item.title}</h2>
              <p>{item.type}</p>
              <ArrowUpRight />
            </a>
          ))}
        </div>
      </section>
    </>
  )
}

function NextPage({ href, label, title }: { href: string; label: string; title: string }) {
  return (
    <a className="next-page" href={href}>
      <span>{label}</span>
      <strong>{title}</strong>
      <ArrowRight />
    </a>
  )
}

function NotFoundPage() {
  return (
    <section className="not-found section">
      <div className="section-inner">
        <SectionLabel>404</SectionLabel>
        <h1>Page not found</h1>
        <a className="button button--dark" href="/">Return home <ArrowRight /></a>
      </div>
    </section>
  )
}

function App() {
  const currentPath = normalizePath(window.location.pathname)
  const pageMeta = getPageMeta(currentPath)
  let page: ReactNode

  useEffect(() => {
    document.title = pageMeta.title
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', pageMeta.description)
  }, [pageMeta.description, pageMeta.title])

  switch (currentPath) {
    case '/':
      page = <HomePage />
      break
    case '/portfolio/':
      page = <PerformancePage />
      break
    case '/portfolio/performance/':
      page = <PerformancePage />
      break
    case '/portfolio/teaching/':
      page = <TeachingPage />
      break
    case '/portfolio/film-screen/':
      page = <FilmScreenPage />
      break
    case '/classes/':
      page = <ClassesPage />
      break
    case '/contact/':
      page = <ContactPage />
      break
    case '/press/':
      page = <PressPage />
      break
    default:
      page = <NotFoundPage />
  }

  return <PageShell currentPath={currentPath}>{page}</PageShell>
}

export default App
