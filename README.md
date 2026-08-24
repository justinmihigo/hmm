# Honore Hartel portfolio

A client-rendered React portfolio and booking website for Kigali-based dance artist, choreographer, teacher, and actor Honore Hartel (Honore Manzi Murengezi).

## Development

```bash
npm install
npm run dev
```

Run `npm run build` for a production build and `npm run lint` for static checks.

## Production setup

The contact and class-booking forms send through EmailJS. Add the three EmailJS dashboard identifiers before building:

```bash
VITE_EMAILJS_PUBLIC_KEY=your-public-key \
VITE_EMAILJS_SERVICE_ID=service_your-id \
VITE_EMAILJS_TEMPLATE_ID=template_your-id \
npm run build
```

Use these template variables in EmailJS: `subject`, `form_type`, `name`, `email`, `service`, `date`, `location`, and `message`. Set the template's Reply-To value to `{{email}}`. The forms include a honeypot, block headless submissions, and apply a ten-second client-side rate limit. Configure the production domain allowlist in EmailJS and enable template reCAPTCHA if spam becomes an issue. Without a Service ID and Template ID, the interface stays visible but directs visitors to the listed email or phone details.

The React app handles these URLs:

- `/`
- `/portfolio/`
- `/portfolio/performance/`
- `/portfolio/teaching/`
- `/portfolio/film-screen/`
- `/classes/`
- `/contact/`
- `/press/`

Configure the production host to rewrite those paths to `/index.html` so direct visits and browser refreshes load the React app. Because this is a client-rendered app, the initial HTML contains the site-wide title and description; page-specific titles are applied after React loads.

## Optional hero video

The homepage uses a pinned Three.js sequence driven by normal vertical scrolling. To add an owned 5–8 second loop as an additional scene, provide an optimized WebM and/or MP4 and set `VITE_HERO_VIDEO_WEBM` and `VITE_HERO_VIDEO_MP4` at build time. The still remains its poster; the video plays muted and inline only while its scene is active, pauses off-screen, and stays paused when reduced motion is requested.
