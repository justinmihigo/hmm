import { useEffect, useState, type FormEvent } from 'react'
import dearChildrenImage from './assets/dear-children.jpg'
import giftOfTimeImage from './assets/gift-of-time.jpg'
import homeOfDanceLogo from './assets/home-of-dance-logo.png'
import homeOfDanceImage from './assets/home-of-dance.jpg'
import movementImage from './assets/honore-movement.jpg'
import portraitImage from './assets/honore-portrait.jpg'
import romeoJulietImage from './assets/romeo-juliet.jpg'
import stagePortraitImage from './assets/stage-portrait.jpg'
import untoldStoryImage from './assets/untold-story.jpg'
import ensembleImage from './assets/ubumuntu-ensemble.jpg'

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Selected work', href: '#work' },
  { label: 'Practice', href: '#practice' },
  { label: 'Press', href: '#press' },
]

const featuredWorks = [
  {
    title: 'Romeo / Juliet — Paradise',
    year: '2026',
    place: 'Germany',
    role: 'Lead performer · Romeo',
    description:
      'A German–Rwandan contemporary reimagining of Shakespeare, performed across Görlitz, Cottbus, and Bautzen.',
    image: romeoJulietImage,
    alt: 'Honore performing in Romeo / Juliet — Paradise under a stage spotlight',
    href: 'https://youtu.be/loTygOn0Xbs?si=wyqDkoZjcLgZ0Yr2',
    layout: 'wide',
  },
  {
    title: 'Gift of Time',
    year: '2024',
    place: 'Kigali, Rwanda',
    role: 'Performer · Choreography transmission',
    description:
      'A 100-dancer commemorative work for Kwibuka30, tracing Rwanda’s journey through loss, resilience, and transformation.',
    image: giftOfTimeImage,
    alt: 'A large dance ensemble performing Gift of Time on stage',
    href: 'https://www.youtube.com/watch?v=0_AMzkaXCs0',
    layout: 'portrait',
  },
  {
    title: 'Untold Story',
    year: '2025',
    place: 'Short film',
    role: 'Actor · Dancer · Creative',
    description:
      'An intimate film about the silent battles dancers carry beyond the glow of the stage, created with Kiseki Films.',
    image: untoldStoryImage,
    alt: 'Black-and-white film stills from Untold Story',
    href: 'https://youtu.be/Wo2TUVKasP0?si=3TohQwudfHWnu9HP',
    layout: 'portrait',
  },
  {
    title: 'Rhymes of Remembrance',
    year: '2025',
    place: 'Kigali, Rwanda',
    role: 'Performer',
    description:
      'Poetry, testimony, and sound translated into movement before more than 8,600 young people for Kwibuka31.',
    image: stagePortraitImage,
    alt: 'Honore and fellow performers sharing a joyful moment on stage',
    href: 'https://www.youtube.com/watch?v=zObtKvHdBLU',
    layout: 'wide',
  },
]

const projectIndex = [
  ['Dear Children, Sincerely…', 'Actor & dancer', 'Sri Lanka · UAE', '2025'],
  ['The We in Me', 'Performer', 'Ubumuntu Arts Festival', '2025'],
  ['Fragility', 'Performer', 'Kigali, Rwanda', '2025'],
  ['Rebirth', 'Choreographer & performer', 'Kigali, Rwanda', '2025'],
  ['Metamorphosis', 'Co-choreographer & performer', 'Kigali, Rwanda', '2024'],
]

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

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [bookingPrepared, setBookingPrepared] = useState(false)

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('[data-reveal]')
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (reducedMotion) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px' },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.body.classList.toggle('menu-is-open', menuOpen)
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.classList.remove('menu-is-open')
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  const handleBooking = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '')
    const email = String(data.get('email') ?? '')
    const service = String(data.get('service') ?? '')
    const date = String(data.get('date') ?? '')
    const location = String(data.get('location') ?? '')
    const message = String(data.get('message') ?? '')

    const subject = encodeURIComponent(`Booking inquiry — ${service}`)
    const body = encodeURIComponent(
      `Hello Honore,\n\nI’d like to discuss a ${service.toLowerCase()} booking.\n\nName: ${name}\nEmail: ${email}\nPreferred date: ${date || 'Flexible'}\nLocation: ${location}\n\nProject details:\n${message}\n\nBest,\n${name}`,
    )

    setBookingPrepared(true)
    window.location.href = `mailto:manzihonore1@gmail.com?subject=${subject}&body=${body}`
  }

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#top" aria-label="Honore Manzi — home">
            <span className="brand-mark">HM</span>
            <span className="brand-name">
              Honore Manzi
              <small>Dance artist</small>
            </span>
          </a>

          <nav className="desktop-nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <a className="header-cta" href="#book">
            Book Honore
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
          {navItems.map((item, index) => (
            <a key={item.href} href={item.href} onClick={closeMenu}>
              <span>0{index + 1}</span>
              {item.label}
            </a>
          ))}
          <a className="mobile-book" href="#book" onClick={closeMenu}>
            Start a project
            <ArrowUpRight />
          </a>
        </nav>
      </header>

      <main id="main-content">
        <section className="hero" id="top">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow hero-eyebrow hero-enter hero-enter--one">
                Kigali, Rwanda · Working worldwide
              </p>
              <h1 className="hero-title hero-enter hero-enter--two">
                Movement
                <span>that carries</span>
                <em>memory.</em>
              </h1>
              <div className="hero-intro hero-enter hero-enter--three">
                <p>
                  Honore Manzi Murengezi is a dance artist, choreographer,
                  teacher, and actor creating work where culture and
                  contemporary movement meet.
                </p>
                <div className="hero-actions">
                  <a className="button button--dark" href="#work">
                    Explore the work
                    <ArrowRight />
                  </a>
                  <a className="text-link" href="#book">
                    Start a project
                    <ArrowUpRight />
                  </a>
                </div>
              </div>
            </div>

            <div className="hero-visual hero-enter hero-enter--four">
              <div className="hero-image-offset" aria-hidden="true" />
              <div className="hero-image-wrap">
                <img
                  src={movementImage}
                  alt="Honore Manzi moving across a stage in a moment of stillness"
                  fetchPriority="high"
                />
              </div>
              <div className="hero-stamp" aria-label="Kimo — tradition in motion">
                <span>KIMO</span>
                <small>Tradition in motion</small>
              </div>
              <p className="image-caption">Dance / Choreography / Film</p>
            </div>
          </div>

          <a className="scroll-cue" href="#about" aria-label="Scroll to about">
            <span>Scroll to discover</span>
            <svg viewBox="0 0 24 32" aria-hidden="true">
              <path d="M12 2v26m-7-7 7 7 7-7" />
            </svg>
          </a>
        </section>

        <div className="role-ticker" aria-label="Honore's creative disciplines">
          <div className="ticker-track">
            {[0, 1].map((group) => (
              <div className="ticker-group" aria-hidden={group === 1} key={group}>
                <span>Dance artist</span>
                <i>✦</i>
                <span>Choreographer</span>
                <i>✦</i>
                <span>Teacher</span>
                <i>✦</i>
                <span>Actor</span>
                <i>✦</i>
              </div>
            ))}
          </div>
        </div>

        <section className="about section" id="about">
          <div className="section-inner">
            <div className="section-kicker" data-reveal>
              <span>01</span>
              <p>About the artist</p>
            </div>

            <div className="about-heading" data-reveal>
              <h2>
                Storytelling through the body, rooted in Rwanda and open to
                the world.
              </h2>
            </div>

            <div className="about-grid">
              <figure className="about-portrait" data-reveal>
                <img
                  src={portraitImage}
                  alt="Portrait of Honore Manzi in Kigali"
                  loading="lazy"
                />
                <figcaption>Honore Manzi Murengezi / Kigali</figcaption>
              </figure>

              <div className="about-copy" data-reveal>
                <p className="lead">
                  Also known as Honore Hartel, he has built a multidisciplinary
                  practice across stage, screen, choreography, and dance
                  education.
                </p>
                <p>
                  His work connects movement, culture, and human experience —
                  from intimate theatre productions to arena ceremonies, from
                  Kigali to Germany, Sri Lanka, and the UAE. He is the founder
                  of Home of Dance and the creator of KIMO, an original movement
                  language fusing Rwandan traditional dance, Gakondo, with
                  contemporary forms.
                </p>

                <div className="stats-grid" aria-label="Career highlights">
                  <div>
                    <strong>4+</strong>
                    <span>Years in professional practice</span>
                  </div>
                  <div>
                    <strong>4</strong>
                    <span>Countries performed in</span>
                  </div>
                  <div>
                    <strong>150+</strong>
                    <span>Students through Home of Dance</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="discipline-row">
              {[
                ['Performance', 'Stage presence shaped by emotional clarity and cultural storytelling.'],
                ['Choreography', 'Original movement made for theatre, film, ceremony, and live events.'],
                ['Education', 'Open, generous teaching for every age and level of experience.'],
              ].map(([title, copy], index) => (
                <article data-reveal key={title}>
                  <span>0{index + 1}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="work section" id="work">
          <div className="section-inner">
            <div className="work-header">
              <div className="section-kicker section-kicker--light" data-reveal>
                <span>02</span>
                <p>Selected work</p>
              </div>
              <h2 data-reveal>On stage. On screen. In motion.</h2>
              <p data-reveal>
                A selection of international collaborations, company
                productions, commemorative works, and original choreography.
              </p>
            </div>

            <div className="work-grid">
              {featuredWorks.map((work, index) => (
                <article
                  className={`work-card work-card--${work.layout}`}
                  data-reveal
                  key={work.title}
                >
                  <a
                    className="work-media"
                    href={work.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Watch ${work.title}`}
                  >
                    <img src={work.image} alt={work.alt} loading="lazy" />
                    <span className="work-number">0{index + 1}</span>
                    <span className="watch-pill">
                      Watch work
                      <ArrowUpRight />
                    </span>
                  </a>
                  <div className="work-card-copy">
                    <div className="work-meta">
                      <span>{work.year}</span>
                      <span>{work.place}</span>
                    </div>
                    <h3>
                      <a href={work.href} target="_blank" rel="noreferrer">
                        {work.title}
                        <ArrowUpRight />
                      </a>
                    </h3>
                    <p className="work-role">{work.role}</p>
                    <p>{work.description}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="project-index" data-reveal>
              <div className="project-index-title">
                <span>More from the repertoire</span>
                <p>Selected stage and choreographic credits</p>
              </div>
              {projectIndex.map(([title, role, place, year], index) => (
                <div className="project-row" key={title}>
                  <span className="project-count">{String(index + 5).padStart(2, '0')}</span>
                  <h3>{title}</h3>
                  <p>{role}</p>
                  <p>{place}</p>
                  <time>{year}</time>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="practice section" id="practice">
          <div className="section-inner">
            <div className="section-kicker" data-reveal>
              <span>03</span>
              <p>Practice & education</p>
            </div>

            <div className="practice-grid">
              <div className="practice-copy" data-reveal>
                <p className="practice-label">Founded in Kigali · 2024</p>
                <h2>Home of Dance</h2>
                <p className="practice-lead">
                  More than a class — a growing community for movement,
                  exchange, and creative possibility.
                </p>
                <p>
                  Honore leads weekly Afro Fusion classes, Afro Hip Hop for
                  children, and pop-up workshops with guest teachers. Built
                  without a permanent venue, the platform has already welcomed
                  more than 150 students and six guest artists.
                </p>
                <a
                  className="button button--outline"
                  href="https://www.instagram.com/home.ofdance?igsh=MTNvazk1OW4yNmJoMg=="
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit Home of Dance
                  <ArrowUpRight />
                </a>
              </div>

              <div className="practice-image" data-reveal>
                <img
                  src={homeOfDanceImage}
                  alt="Honore with students and guest teachers at Home of Dance"
                  loading="lazy"
                />
                <img
                  className="hod-logo"
                  src={homeOfDanceLogo}
                  alt="Home of Dance"
                  loading="lazy"
                />
                <div className="practice-stat">
                  <strong>150+</strong>
                  <span>students and counting</span>
                </div>
              </div>
            </div>

            <div className="services" data-reveal>
              <p>Available for</p>
              <div className="service-list">
                {[
                  'Performance',
                  'Choreography',
                  'Workshops',
                  'Creative collaboration',
                ].map((service) => (
                  <a href="#book" key={service}>
                    <span>{service}</span>
                    <ArrowUpRight />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="visual-interlude" aria-label="Performance gallery">
          <figure className="interlude-small" data-reveal>
            <img
              src={dearChildrenImage}
              alt="Honore in costume during Dear Children, Sincerely"
              loading="lazy"
            />
            <figcaption>Dear Children, Sincerely / International tour</figcaption>
          </figure>
          <div className="interlude-statement" data-reveal>
            <p>“The body becomes the voice memory speaks through.”</p>
            <span>— Honore Manzi</span>
          </div>
          <figure className="interlude-large" data-reveal>
            <img
              src={ensembleImage}
              alt="Contemporary dance ensemble on stage in warm light"
              loading="lazy"
            />
            <figcaption>Ubumuntu Arts Festival / Kigali, Rwanda</figcaption>
          </figure>
        </section>

        <section className="press section" id="press">
          <div className="section-inner">
            <div className="section-kicker" data-reveal>
              <span>04</span>
              <p>Press & media</p>
            </div>

            <div className="press-heading" data-reveal>
              <h2>Tradition does not stand still.</h2>
              <p>
                Features on the ideas, ambition, and cultural movement behind
                Honore’s practice.
              </p>
            </div>

            <div className="press-list">
              <a
                className="press-item"
                href="https://www.dw.com/en/how-tradition-moves-forward-in-rwanda/video-76792121"
                target="_blank"
                rel="noreferrer"
                data-reveal
              >
                <span className="press-source">Deutsche Welle</span>
                <h3>How tradition moves forward in Rwanda</h3>
                <span className="press-type">Video feature · 2026</span>
                <span className="press-arrow">
                  <ArrowUpRight />
                </span>
              </a>
              <a
                className="press-item"
                href="https://www.newtimes.co.rw/article/1210/lifestyle/people/local-performer-on-how-dance-can-be-a-money-making-career"
                target="_blank"
                rel="noreferrer"
                data-reveal
              >
                <span className="press-source">The New Times Rwanda</span>
                <h3>How dance can become a money-making career</h3>
                <span className="press-type">Profile · 2022</span>
                <span className="press-arrow">
                  <ArrowUpRight />
                </span>
              </a>
            </div>
          </div>
        </section>

        <section className="booking section" id="book">
          <div className="section-inner booking-grid">
            <div className="booking-intro" data-reveal>
              <div className="section-kicker section-kicker--light">
                <span>05</span>
                <p>Bookings & collaborations</p>
              </div>
              <h2>Have a stage, story, or idea in mind?</h2>
              <p>
                Share the shape of your project and Honore will get back to you
                about availability, approach, and next steps.
              </p>

              <div className="direct-contact">
                <a href="mailto:manzihonore1@gmail.com">
                  <span>Email</span>
                  manzihonore1@gmail.com
                </a>
                <a href="tel:+250788634358">
                  <span>Phone</span>
                  +250 788 634 358
                </a>
                <p>
                  <span>Based in</span>
                  Kigali, Rwanda · Available worldwide
                </p>
              </div>
            </div>

            <form className="booking-form" onSubmit={handleBooking} data-reveal>
              <div className="form-heading">
                <span>Booking request</span>
                <p>Tell me about the project.</p>
              </div>

              <div className="form-row">
                <label>
                  Your name
                  <input name="name" type="text" autoComplete="name" required />
                </label>
                <label>
                  Email address
                  <input name="email" type="email" autoComplete="email" required />
                </label>
              </div>

              <label>
                What are you looking for?
                <select name="service" defaultValue="" required>
                  <option value="" disabled>
                    Choose a service
                  </option>
                  <option>Performance</option>
                  <option>Choreography</option>
                  <option>Workshop</option>
                  <option>Creative collaboration</option>
                  <option>Film / acting</option>
                  <option>Other</option>
                </select>
              </label>

              <div className="form-row">
                <label>
                  Preferred date
                  <input name="date" type="date" />
                </label>
                <label>
                  City / venue
                  <input name="location" type="text" required />
                </label>
              </div>

              <label>
                Project details
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Audience, scope, timing, and anything else Honore should know."
                  required
                />
              </label>

              <button className="form-submit" type="submit">
                Prepare booking email
                <ArrowRight />
              </button>
              <p className="form-note" role="status" aria-live="polite">
                {bookingPrepared
                  ? 'Your email app should open with the booking details filled in.'
                  : 'Submitting opens your email app with the details filled in.'}
              </p>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-top">
          <a className="footer-brand" href="#top">
            Honore
            <span>Manzi.</span>
          </a>
          <p>Dance artist · Choreographer · Teacher · Actor</p>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Honore Manzi Murengezi</span>
          <div>
            <a
              href="https://linktr.ee/honorehartel"
              target="_blank"
              rel="noreferrer"
            >
              Socials <ArrowUpRight />
            </a>
            <a href="mailto:manzihonore1@gmail.com">
              Email <ArrowUpRight />
            </a>
            <a href="#top">Back to top ↑</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
