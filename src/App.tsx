import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'
import emailjs from '@emailjs/browser'
import giftOfTimeImage from './assets/gift-of-time.jpg'
import homeOfDanceLogo from './assets/home-of-dance-logo.png'
import homeOfDanceImage from './assets/home-of-dance.jpg'
import portraitImage from './assets/honore-portrait.jpg'
import romeoJulietImage from './assets/romeo-juliet.jpg'
import stagePortraitImage from './assets/stage-portrait.jpg'
import studioImage from './assets/studio-rehearsal.jpg'
import ensembleImage from './assets/ubumuntu-ensemble.jpg'
import untoldStoryImage from './assets/untold-story.jpg'
import ThreeScrollHero from './components/ThreeScrollHero'

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
    title: 'Portfolio — Honore Hartel',
    description:
      'Performance, teaching, film, and screen work by Rwandan dance artist Honore Hartel.',
  },
  '/portfolio/performance/': {
    title: 'Performance — Honore Hartel',
    description:
      'Selected international and Rwandan performance work by Honore Hartel, including Romeo / Juliet — Paradise and Gift of Time.',
  },
  '/portfolio/teaching/': {
    title: 'Teaching — Honore Hartel',
    description:
      'Teaching practice, workshops, and Home of Dance work led by Honore Hartel in Kigali and beyond.',
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
      'Contact Honore Hartel for performance, choreography, teaching, acting, and creative collaborations.',
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
                href="/portfolio/"
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
      <div className="footer-main">
        <a className="footer-name" href="/">
          Honore Hartel
        </a>
        <p>Dance Artist · Choreographer · Teacher · Actor</p>
        <a className="footer-contact" href="/contact/">
          Get in touch <ArrowUpRight />
        </a>
      </div>
      <div className="footer-socials" aria-label="Social links">
        <span>Follow</span>
        <a
          href="https://linktr.ee/honorehartel"
          target="_blank"
          rel="noreferrer"
        >
          Honore’s socials <ArrowUpRight />
        </a>
        <a
          href="https://www.instagram.com/home.ofdance?igsh=MTNvazk1OW4yNmJoMg=="
          target="_blank"
          rel="noreferrer"
        >
          Home of Dance <ArrowUpRight />
        </a>
      </div>
      <div className="footer-meta">
        <span>© {new Date().getFullYear()} Honore Hartel</span>
        <a href="/press/">Press</a>
        <a href="/contact/">Contact</a>
        <a href="#main-content">Back to top ↑</a>
      </div>
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

function Stat({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
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

      <section className="kimo section" id="kimo" aria-labelledby="kimo-title">
        <div className="section-inner">
          <SectionLabel>Original movement language</SectionLabel>
          <div className="kimo-heading">
            <h2 id="kimo-title">
              KIMO
            </h2>
            <p>
              KIMO brings the grounding of Rwanda's Gakondo into conversation
              with contemporary movement.
            </p>
          </div>
          <div className="kimo-media">
            <figure className="kimo-image">
              <img
                src={studioImage}
                alt="Honore Hartel in movement during a rehearsal"
                width="1800"
                height="1200"
                loading="lazy"
              />
            </figure>
            <div className="kimo-video">
              <iframe
                src="https://www.dailymotion.com/embed/video/xa6ww70"
                title="How tradition moves forward in Rwanda — Honore Hartel"
                allow="autoplay; fullscreen; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
          <div className="kimo-foot">
            <p>
              An original style created by Honore Hartel, shaped through
              Rwandan traditional dance, Afro movement, and contemporary form.
            </p>
            <a
              className="button button--line"
              href="https://www.dw.com/en/how-tradition-moves-forward-in-rwanda/video-76792121"
              target="_blank"
              rel="noreferrer"
            >
              Learn more <ArrowUpRight />
            </a>
          </div>
        </div>
      </section>

      <section className="about section" id="about" aria-labelledby="about-title">
        <div className="section-inner">
          <SectionLabel>About</SectionLabel>
          <div className="about-grid">
            <div className="about-copy">
              <h2 id="about-title">
              Honore Hartel
              </h2>
              <p className="about-lead">
                A Rwandan dance artist working across performance,
                choreography, education, and film.
              </p>
              <p>
                Honore Manzi Murengezi, known professionally as Honore Hartel,
                builds work through movement, culture, and human experience.
                His practice moves from intimate theatre productions to large
                commemorative works, and from Kigali to Germany, Sri Lanka,
                and the UAE.
              </p>
              <p>
                He is the founder of Home of Dance and the creator of KIMO, an
                original movement language rooted in Rwanda and open to
                contemporary forms.
              </p>
              <a className="text-link" href="/portfolio/">
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
            <Stat value={4} suffix="+" label="Years in professional practice" />
            <Stat value={4} label="Countries performed in" />
            <Stat value={150} suffix="+" label="Students through Home of Dance" />
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

function PortfolioPage() {
  const categories = [
    {
      ...portfolioLinks[0],
      image: romeoJulietImage,
      alt: 'Honore Hartel performing Romeo in Romeo / Juliet — Paradise',
      copy: 'Stage work, international collaborations, and original choreography.',
    },
    {
      ...portfolioLinks[1],
      image: homeOfDanceImage,
      alt: 'Home of Dance students and teachers together in Kigali',
      copy: 'Classes, workshops, and movement practice for different ages and levels.',
    },
    {
      ...portfolioLinks[2],
      image: untoldStoryImage,
      alt: 'Black-and-white stills from the short film Untold Story',
      copy: 'Acting, dance, and movement created for the camera.',
    },
  ]

  return (
    <>
      <PageIntro eyebrow="Work" title="Portfolio">
        <p>Performance, teaching, film, and screen.</p>
      </PageIntro>
      <section className="portfolio-categories section" aria-label="Portfolio categories">
        <div className="section-inner category-grid">
          {categories.map((category, index) => (
            <a className="category-card" href={category.href} key={category.href}>
              <figure>
                <img
                  src={category.image}
                  alt={category.alt}
                  width={index === 2 ? 839 : index === 1 ? 1600 : 1800}
                  height={index === 2 ? 1500 : 1200}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </figure>
              <div>
                <span>0{index + 1}</span>
                <h2>{category.label}</h2>
                <p>{category.copy}</p>
                <ArrowUpRight />
              </div>
            </a>
          ))}
        </div>
      </section>
      <section className="portfolio-press section">
        <div className="section-inner simple-cta">
          <div>
            <SectionLabel>Press</SectionLabel>
            <h2>Interviews and features</h2>
          </div>
          <a className="button button--dark" href="/press/">
            View press <ArrowRight />
          </a>
        </div>
      </section>
    </>
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
        <p>Movement practice shared through classes, workshops, and community.</p>
      </PageIntro>
      <section className="feature-layout section">
        <div className="section-inner feature-grid">
          <figure className="feature-image">
            <img
              src={homeOfDanceImage}
              alt="Honore Hartel with Home of Dance students and guest teachers"
              width="1600"
              height="1200"
            />
            <img className="feature-logo" src={homeOfDanceLogo} alt="Home of Dance" width="960" height="960" />
          </figure>
          <div className="feature-copy">
            <SectionLabel>Founded in Kigali · 2024</SectionLabel>
            <h2>Home of Dance</h2>
            <p className="large-copy">
              A growing space for movement, exchange, and creative possibility.
            </p>
            <p>
              Honore leads Afro Fusion, Afro Hip Hop for children, and pop-up
              workshops with guest teachers. The platform has welcomed more
              than 150 students and six guest artists.
            </p>
            <div className="inline-stats">
              <span><strong>150+</strong> students</span>
              <span><strong>6</strong> guest artists</span>
            </div>
            <div className="button-row">
              <a className="button button--dark" href="/classes/">
                View classes <ArrowRight />
              </a>
              <a
                className="button button--line"
                href="https://www.instagram.com/home.ofdance?igsh=MTNvazk1OW4yNmJoMg=="
                target="_blank"
                rel="noreferrer"
              >
                Home of Dance <ArrowUpRight />
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="teaching-list section">
        <div className="section-inner">
          <SectionLabel>Teaching formats</SectionLabel>
          <div className="line-list">
            <div><span>01</span><h2>Open classes</h2><p>Afro Fusion and movement practice in Kigali.</p></div>
            <div><span>02</span><h2>Children</h2><p>Afro Hip Hop and creative movement.</p></div>
            <div><span>03</span><h2>Workshops</h2><p>Guest sessions, intensives, and tailored group work.</p></div>
          </div>
        </div>
      </section>
      <NextPage href="/portfolio/film-screen/" label="Next" title="Film & Screen" />
    </>
  )
}

function FilmScreenPage() {
  return (
    <>
      <PageIntro eyebrow="Portfolio" title="Film & Screen">
        <p>Acting, dance, and movement for camera.</p>
      </PageIntro>
      <section className="film-feature section">
        <div className="section-inner film-grid">
          <figure>
            <img
              src={untoldStoryImage}
              alt="Black-and-white film stills from Untold Story"
              width="839"
              height="1500"
            />
          </figure>
          <div className="film-copy">
            <div className="work-meta"><span>2025</span><span>Short film</span></div>
            <h2>Untold Story</h2>
            <p className="work-role">Actor · Dancer · Creative</p>
            <p>
              An intimate film about the silent battles dancers carry beyond
              the glow of the stage, created with Kiseki Films.
            </p>
            <a
              className="button button--dark"
              href="https://youtu.be/Wo2TUVKasP0?si=3TohQwudfHWnu9HP"
              target="_blank"
              rel="noreferrer"
            >
              Watch film <ArrowUpRight />
            </a>
          </div>
        </div>
      </section>
      {/* <section className="screen-still">
        <img
          src={studioImage}
          alt="Honore Hartel during a filmed movement rehearsal"
          width="1800"
          height="1200"
          loading="lazy"
        />
      </section> */}
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
      <PageIntro eyebrow="Classes" title="Home of Dance">
        <p>Classes and workshops led by Honore Hartel in Kigali.</p>
      </PageIntro>
      <section className="classes-overview section">
        <div className="section-inner classes-grid">
          <div className="classes-image">
            <img
              src={homeOfDanceImage}
              alt="The Home of Dance community in Kigali"
              width="1600"
              height="1200"
            />
            <img src={homeOfDanceLogo} alt="Home of Dance" width="960" height="960" />
          </div>
          <div className="classes-copy">
            <SectionLabel>Weekly in Kigali</SectionLabel>
            <h2>Current class formats</h2>
            <div className="class-list">
              <article><span>01</span><div><h3>Afro Fusion</h3><p>Open movement practice shaped by African forms and contemporary influences.</p></div></article>
              <article><span>02</span><div><h3>Afro Hip Hop for children</h3><p>Rhythm, coordination, confidence, and creative movement.</p></div></article>
              <article><span>03</span><div><h3>Guest workshops</h3><p>Pop-up sessions with local and visiting dance artists.</p></div></article>
            </div>
            <p className="availability-note">
              Dates, venue, level, and price are confirmed with each booking.
            </p>
          </div>
        </div>
      </section>
      <section className="class-booking section" aria-labelledby="class-booking-title">
        <div className="section-inner booking-grid">
          <div>
            <SectionLabel>Booking</SectionLabel>
            <h2 id="class-booking-title">Book a class</h2>
            <p>
              Share who the class is for, your level, and the date that works
              for you. Home of Dance will reply with the current options.
            </p>
          </div>
          <ContactForm defaultService="Class booking" compact />
        </div>
      </section>
    </>
  )
}

function ContactPage() {
  return (
    <>
      <PageIntro eyebrow="Contact" title="Get in touch">
        <p>Performance, choreography, teaching, acting, and collaboration.</p>
      </PageIntro>
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
      page = <PortfolioPage />
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
