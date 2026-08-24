import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import type {
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  Texture,
  VideoTexture,
  WebGLRenderer,
} from 'three'
import giftOfTimeImage from '../assets/gift-of-time.jpg'
import homeOfDanceImage from '../assets/home-of-dance.jpg'
import movementImage from '../assets/honore-movement.jpg'
import romeoJulietImage from '../assets/romeo-juliet.jpg'
import studioImage from '../assets/studio-rehearsal.jpg'

type ImageSlide = {
  kind: 'image'
  id: string
  title: string
  context: string
  src: string
  alt: string
  width: number
  height: number
  focusX: number
  focusY: number
}

type VideoSlide = {
  kind: 'video'
  id: string
  title: string
  context: string
  poster: string
  alt: string
  width: number
  height: number
  focusX: number
  focusY: number
  mp4?: string
  webm?: string
}

type HeroSlide = ImageSlide | VideoSlide
type HeroStatus = 'loading' | 'ready' | 'unsupported'

type SlideResource = {
  texture: Texture
  aspect: number
  video?: HTMLVideoElement
  videoTexture?: VideoTexture
}

const heroVideoMp4 = import.meta.env.VITE_HERO_VIDEO_MP4?.trim() ?? ''
const heroVideoWebm = import.meta.env.VITE_HERO_VIDEO_WEBM?.trim() ?? ''

const photoSlides: ImageSlide[] = [
  {
    kind: 'image',
    id: 'movement',
    title: 'Honore Hartel',
    context: 'Dance artist · Kigali, Rwanda',
    src: movementImage,
    alt: 'Honore Hartel dancing alone on a stage',
    width: 1333,
    height: 2000,
    focusX: 0.5,
    focusY: 0.52,
  },
  {
    kind: 'image',
    id: 'romeo-juliet',
    title: 'Romeo / Juliet — Paradise',
    context: 'Lead performer · Germany, 2026',
    src: romeoJulietImage,
    alt: 'Honore Hartel performing in Romeo / Juliet — Paradise',
    width: 1800,
    height: 1200,
    focusX: 0.65,
    focusY: 0.5,
  },
  {
    kind: 'image',
    id: 'gift-of-time',
    title: 'Gift of Time',
    context: 'Performer · Kigali, 2024',
    src: giftOfTimeImage,
    alt: 'Honore Hartel and a large ensemble performing Gift of Time',
    width: 1800,
    height: 1200,
    focusX: 0.52,
    focusY: 0.42,
  },
  {
    kind: 'image',
    id: 'home-of-dance',
    title: 'Home of Dance',
    context: 'Founder & teacher · Kigali',
    src: homeOfDanceImage,
    alt: 'Honore Hartel with the Home of Dance community in Kigali',
    width: 1600,
    height: 1200,
    focusX: 0.5,
    focusY: 0.48,
  },
  {
    kind: 'image',
    id: 'rehearsal',
    title: 'In rehearsal',
    context: 'Movement practice · Kigali',
    src: studioImage,
    alt: 'Honore Hartel moving through a studio rehearsal',
    width: 1800,
    height: 1200,
    focusX: 0.61,
    focusY: 0.46,
  },
]

const videoSlide: VideoSlide | null =
  heroVideoMp4 || heroVideoWebm
    ? {
        kind: 'video',
        id: 'movement-film',
        title: 'Movement in focus',
        context: 'A short study in motion',
        poster: movementImage,
        alt: 'A short movement film featuring Honore Hartel',
        width: 1333,
        height: 2000,
        focusX: 0.5,
        focusY: 0.5,
        mp4: heroVideoMp4 || undefined,
        webm: heroVideoWebm || undefined,
      }
    : null

const heroSlides: HeroSlide[] = videoSlide
  ? [photoSlides[0], videoSlide, ...photoSlides.slice(1)]
  : photoSlides

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value))

function cropTextureToPlane(
  texture: Texture,
  sourceAspect: number,
  planeAspect: number,
  focusX: number,
  focusY: number,
) {
  texture.repeat.set(1, 1)
  texture.offset.set(0, 0)

  if (sourceAspect > planeAspect) {
    const horizontalRepeat = planeAspect / sourceAspect
    texture.repeat.x = horizontalRepeat
    texture.offset.x = (1 - horizontalRepeat) * focusX
  } else if (sourceAspect < planeAspect) {
    const verticalRepeat = sourceAspect / planeAspect
    texture.repeat.y = verticalRepeat
    texture.offset.y = (1 - verticalRepeat) * (1 - focusY)
  }

  texture.needsUpdate = true
}

function getReducedMotionPreference() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export default function ThreeScrollHero() {
  const storyRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const [activeSlide, setActiveSlide] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(
    getReducedMotionPreference,
  )
  const [status, setStatus] = useState<HeroStatus>('loading')
  const staticMode = reducedMotion || status === 'unsupported'

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncPreference = () => setReducedMotion(mediaQuery.matches)

    syncPreference()
    mediaQuery.addEventListener('change', syncPreference)
    return () => mediaQuery.removeEventListener('change', syncPreference)
  }, [])

  useEffect(() => {
    if (reducedMotion) return

    const story = storyRef.current
    const sticky = stickyRef.current
    const canvas = canvasRef.current
    if (!story || !sticky || !canvas) return

    let disposed = false
    let contextLost = false
    let heroVisible = true
    let renderedScene = 0
    let targetScene = 0
    let previousTime = 0
    let lastActiveSlide = -1
    let renderer: WebGLRenderer | null = null
    let scene: Scene | null = null
    let camera: PerspectiveCamera | null = null
    let geometry: PlaneGeometry | null = null
    let resizeObserver: ResizeObserver | null = null
    let intersectionObserver: IntersectionObserver | null = null
    const meshes: Mesh<PlaneGeometry, MeshBasicMaterial>[] = []
    const materials: MeshBasicMaterial[] = []
    const resources: SlideResource[] = []
    const trackedTextures = new Set<Texture>()
    const videoCleanups: Array<() => void> = []
    let resizeScene = () => undefined

    const syncVideoPlayback = () => {
      resources.forEach((resource, index) => {
        if (!resource.video) return
        const shouldPlay =
          heroVisible &&
          !contextLost &&
          document.visibilityState === 'visible' &&
          index === lastActiveSlide

        if (shouldPlay) {
          void resource.video.play().catch(() => undefined)
        } else {
          resource.video.pause()
        }
      })
    }

    const updateScrollTarget = () => {
      const availableScroll = Math.max(1, story.offsetHeight - sticky.offsetHeight)
      const headerHeight =
        document.querySelector<HTMLElement>('.site-header')?.offsetHeight ?? 0
      const travelled = headerHeight - story.getBoundingClientRect().top
      const normalizedProgress = clamp(travelled / availableScroll)
      targetScene = normalizedProgress * (heroSlides.length - 1)

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${normalizedProgress})`
      }
    }

    const initialize = async () => {
      try {
        const [THREE, webglModule] = await Promise.all([
          import('../lib/threeHeroRuntime'),
          import('three/addons/capabilities/WebGL.js'),
        ])
        if (disposed) return

        const WebGL = webglModule.default
        if (!WebGL.isWebGL2Available()) {
          setStatus('unsupported')
          return
        }

        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        })
        renderer.outputColorSpace = THREE.SRGBColorSpace
        renderer.setClearColor(0x070707, 0)

        scene = new THREE.Scene()
        camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)
        camera.position.z = 6.8
        geometry = new THREE.PlaneGeometry(1, 1, 1, 1)

        const textureLoader = new THREE.TextureLoader()
        const maximumAnisotropy = Math.min(
          8,
          renderer.capabilities.getMaxAnisotropy(),
        )

        const loadedResources = await Promise.all(
          heroSlides.map(async (slide): Promise<SlideResource> => {
            const source = slide.kind === 'image' ? slide.src : slide.poster
            const texture = await textureLoader.loadAsync(source)
            texture.colorSpace = THREE.SRGBColorSpace
            texture.anisotropy = maximumAnisotropy

            if (disposed) {
              texture.dispose()
              throw new Error('Hero was disposed while its textures loaded.')
            }

            trackedTextures.add(texture)
            const resource: SlideResource = {
              texture,
              aspect: slide.width / slide.height,
            }

            if (slide.kind === 'video') {
              const video = document.createElement('video')
              video.crossOrigin = 'anonymous'
              video.muted = true
              video.defaultMuted = true
              video.loop = true
              video.playsInline = true
              video.preload = 'auto'

              const canUseWebm =
                slide.webm && video.canPlayType('video/webm') !== ''
              video.src = canUseWebm ? slide.webm ?? '' : slide.mp4 ?? slide.webm ?? ''
              resource.video = video

              if (video.src) video.load()
            }

            return resource
          }),
        )

        if (disposed || !scene || !geometry || !renderer || !camera) {
          loadedResources.forEach((resource) => resource.texture.dispose())
          return
        }

        resources.push(...loadedResources)
        resources.forEach((resource, index) => {
          const material = new THREE.MeshBasicMaterial({
            map: resource.texture,
            color: 0xffffff,
            transparent: true,
            opacity: index === 0 ? 1 : 0,
            depthWrite: false,
            side: THREE.DoubleSide,
          })
          const mesh = new THREE.Mesh(geometry as PlaneGeometry, material)
          mesh.frustumCulled = false
          mesh.userData.baseWidth = 1
          mesh.userData.baseHeight = 1
          materials.push(material)
          meshes.push(mesh)
          scene?.add(mesh)

          if (!resource.video) return

          const video = resource.video
          const activateVideoTexture = () => {
            if (disposed || resource.videoTexture || !renderer) return

            if (video.videoWidth && video.videoHeight) {
              resource.aspect = video.videoWidth / video.videoHeight
            }
            const videoTexture = new THREE.VideoTexture(video)
            videoTexture.colorSpace = THREE.SRGBColorSpace
            resource.videoTexture = videoTexture
            trackedTextures.add(videoTexture)
            material.map = videoTexture
            material.needsUpdate = true
            resizeScene()
            syncVideoPlayback()
          }

          if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
            activateVideoTexture()
          } else {
            video.addEventListener('loadeddata', activateVideoTexture, {
              once: true,
            })
            videoCleanups.push(() =>
              video.removeEventListener('loadeddata', activateVideoTexture),
            )
          }
        })

        resizeScene = () => {
          if (!renderer || !camera || !sticky) return

          const width = Math.max(1, sticky.clientWidth)
          const height = Math.max(1, sticky.clientHeight)
          const compact = width <= 800
          renderer.setPixelRatio(
            Math.min(window.devicePixelRatio || 1, compact ? 1.25 : 1.5),
          )
          renderer.setSize(width, height, false)
          camera.aspect = width / height
          camera.updateProjectionMatrix()

          const visibleHeight =
            2 *
            Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) *
            camera.position.z
          const visibleWidth = visibleHeight * camera.aspect
          const maximumWidth = visibleWidth * (compact ? 0.88 : 0.76)
          const maximumHeight = visibleHeight * (compact ? 0.66 : 0.7)

          resources.forEach((resource, index) => {
            const slide = heroSlides[index]
            const planeAspect = compact
              ? 0.72
              : resource.aspect < 1
                ? 0.72
                : Math.min(resource.aspect, 1.5)
            const widthFromHeight = maximumHeight * planeAspect
            const planeWidth = Math.min(maximumWidth, widthFromHeight)
            const planeHeight = planeWidth / planeAspect
            meshes[index].userData.baseWidth = planeWidth
            meshes[index].userData.baseHeight = planeHeight
            cropTextureToPlane(
              resource.texture,
              resource.aspect,
              planeAspect,
              slide.focusX,
              slide.focusY,
            )
            if (resource.videoTexture) {
              cropTextureToPlane(
                resource.videoTexture,
                resource.aspect,
                planeAspect,
                slide.focusX,
                slide.focusY,
              )
            }
          })
        }

        const renderFrame = (time: number) => {
          if (
            disposed ||
            contextLost ||
            !heroVisible ||
            !renderer ||
            !scene ||
            !camera
          ) {
            return
          }

          const deltaTime = Math.min((time - previousTime) / 1000 || 0, 0.1)
          previousTime = time
          const damping = 1 - Math.exp(-8.5 * deltaTime)
          renderedScene += (targetScene - renderedScene) * damping
          const normalizedProgress =
            heroSlides.length > 1
              ? renderedScene / (heroSlides.length - 1)
              : 0

          if (progressRef.current) {
            progressRef.current.style.transform = `scaleX(${normalizedProgress})`
          }

          meshes.forEach((mesh, index) => {
            const relativePosition = index - renderedScene
            const distance = Math.abs(relativePosition)
            const fade = clamp(1 - distance * 0.62)
            const scale = 1 - Math.min(distance, 1) * 0.1

            mesh.visible = distance < 1.62
            mesh.position.x = relativePosition * 2.35
            mesh.position.y = relativePosition * -0.24
            mesh.position.z = distance * -2.85
            mesh.rotation.y = relativePosition * -0.38
            mesh.rotation.z = relativePosition * 0.025
            mesh.scale.set(
              mesh.userData.baseWidth * scale,
              mesh.userData.baseHeight * scale,
              1,
            )
            mesh.material.opacity = fade
            mesh.renderOrder = 100 - Math.round(distance * 10)
          })

          const nextActiveSlide = Math.round(renderedScene)
          if (nextActiveSlide !== lastActiveSlide) {
            lastActiveSlide = nextActiveSlide
            setActiveSlide(nextActiveSlide)
            syncVideoPlayback()
          }

          renderer.render(scene, camera)
        }

        const startRendering = () => {
          if (!renderer || disposed || contextLost || !heroVisible) return
          previousTime = performance.now()
          renderer.setAnimationLoop(renderFrame)
        }

        const stopRendering = () => {
          renderer?.setAnimationLoop(null)
        }

        const handleIntersection: IntersectionObserverCallback = ([entry]) => {
          heroVisible = entry.isIntersecting
          if (heroVisible) {
            updateScrollTarget()
            startRendering()
          } else {
            stopRendering()
          }
          syncVideoPlayback()
        }

        const handleContextLost = (event: Event) => {
          event.preventDefault()
          contextLost = true
          stopRendering()
          setStatus('loading')
          syncVideoPlayback()
        }

        const handleContextRestored = () => {
          contextLost = false
          setStatus('ready')
          resizeScene()
          updateScrollTarget()
          startRendering()
        }

        resizeObserver = new ResizeObserver(() => {
          resizeScene()
          updateScrollTarget()
        })
        resizeObserver.observe(sticky)
        intersectionObserver = new IntersectionObserver(handleIntersection, {
          rootMargin: '20% 0px',
        })
        intersectionObserver.observe(story)
        window.addEventListener('scroll', updateScrollTarget, { passive: true })
        document.addEventListener('visibilitychange', syncVideoPlayback)
        canvas.addEventListener('webglcontextlost', handleContextLost)
        canvas.addEventListener('webglcontextrestored', handleContextRestored)
        videoCleanups.push(
          () => window.removeEventListener('scroll', updateScrollTarget),
          () => document.removeEventListener('visibilitychange', syncVideoPlayback),
          () => canvas.removeEventListener('webglcontextlost', handleContextLost),
          () =>
            canvas.removeEventListener(
              'webglcontextrestored',
              handleContextRestored,
            ),
        )

        resizeScene()
        updateScrollTarget()
        renderFrame(performance.now())
        setStatus('ready')
        startRendering()
      } catch (error) {
        if (!disposed) {
          console.error('Unable to initialize the Three.js hero.', error)
          setStatus('unsupported')
        }
      }
    }

    void initialize()

    return () => {
      disposed = true
      renderer?.setAnimationLoop(null)
      resizeObserver?.disconnect()
      intersectionObserver?.disconnect()
      videoCleanups.forEach((cleanup) => cleanup())
      resources.forEach((resource) => {
        if (!resource.video) return
        resource.video.pause()
        resource.video.removeAttribute('src')
        resource.video.load()
      })
      meshes.forEach((mesh) => scene?.remove(mesh))
      materials.forEach((material) => material.dispose())
      trackedTextures.forEach((texture) => texture.dispose())
      geometry?.dispose()
      renderer?.renderLists.dispose()
      renderer?.dispose()
    }
  }, [reducedMotion])

  const scrollToSlide = (index: number) => {
    const story = storyRef.current
    const sticky = stickyRef.current
    if (!story || !sticky || staticMode) return

    const availableScroll = Math.max(0, story.offsetHeight - sticky.offsetHeight)
    const headerHeight =
      document.querySelector<HTMLElement>('.site-header')?.offsetHeight ?? 0
    const storyStart =
      window.scrollY + story.getBoundingClientRect().top - headerHeight
    const sceneProgress =
      heroSlides.length > 1 ? index / (heroSlides.length - 1) : 0

    window.scrollTo({
      top: storyStart + availableScroll * sceneProgress,
      behavior: 'smooth',
    })
  }

  const storyStyle = {
    '--hero-story-height': `calc(${100 + (heroSlides.length - 1) * 82}svh - 80px)`,
    '--hero-story-height-mobile': `calc(${100 + (heroSlides.length - 1) * 72}svh - 70px)`,
  } as CSSProperties

  return (
    <section
      className={`hero-story hero-story--${status}${staticMode ? ' hero-story--static' : ''}`}
      style={storyStyle}
      ref={storyRef}
      aria-labelledby="home-title"
    >
      <div className="home-hero" ref={stickyRef}>
        <img
          className="three-hero-fallback"
          src={movementImage}
          alt={status === 'ready' ? '' : 'Honore Hartel dancing alone on a stage'}
          aria-hidden={status === 'ready' ? 'true' : undefined}
          width="1333"
          height="2000"
          fetchPriority="high"
        />
        <canvas
          className="three-hero-canvas"
          ref={canvasRef}
          aria-hidden="true"
        />
        <div className="home-hero-shade" aria-hidden="true" />

        <a className="hero-skip" href="#kimo">
          Skip visual introduction
        </a>

        <h1 id="home-title">
          <span>Dance Artist</span>
          <span>Choreographer</span>
          <span>Teacher</span>
          <span>Actor</span>
        </h1>

        <div className="three-hero-captions" aria-live="off">
          {heroSlides.map((slide, index) => (
            <div
              className={`three-hero-caption${index === activeSlide ? ' is-active' : ''}`}
              key={slide.id}
              aria-hidden={index !== activeSlide}
            >
              <span>
                {String(index + 1).padStart(2, '0')} /{' '}
                {String(heroSlides.length).padStart(2, '0')}
              </span>
              <h2>{slide.title}</h2>
              <p>{slide.context}</p>
            </div>
          ))}
        </div>

        <nav className="three-hero-scenes" aria-label="Hero scenes">
          {heroSlides.map((slide, index) => (
            <button
              type="button"
              key={slide.id}
              aria-label={`Show scene ${index + 1}: ${slide.title}`}
              aria-current={index === activeSlide ? 'step' : undefined}
              onClick={() => scrollToSlide(index)}
            >
              <span />
            </button>
          ))}
        </nav>

        <div className="three-hero-progress" aria-hidden="true">
          <span ref={progressRef} />
        </div>

        <p className="hero-scroll">
          Scroll to reveal <span>↓</span>
        </p>

        <ol className="sr-only">
          {heroSlides.map((slide) => (
            <li key={slide.id}>
              {slide.title}. {slide.context}. {slide.alt}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
