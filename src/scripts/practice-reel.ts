import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const readX = (el: HTMLElement) => {
  const raw = gsap.getProperty(el, 'x');
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  const parsed = parseFloat(String(raw));
  return Number.isFinite(parsed) ? parsed : 0;
};

export function initPracticeReel(signal: AbortSignal): () => void {
  const section = document.querySelector<HTMLElement>('[data-practice-reel]');
  if (!section) return () => {};

  const viewport = section.querySelector<HTMLElement>('.practice-viewport');
  const frames = section.querySelector<HTMLElement>('.practice-frames');
  const cels = Array.from(
    section.querySelectorAll<HTMLElement>('.practice-cel'),
  );
  const captions = Array.from(
    section.querySelectorAll<HTMLElement>('.practice-captions li'),
  );

  if (!viewport || !frames || cels.length === 0) return () => {};

  const lastIndex = cels.length - 1;
  let active = -1;
  let shifts: number[] = [];

  const setCaption = (index: number) => {
    if (index === active) return;
    const previous = active;
    section.dataset.reelDir = index >= previous ? '1' : '-1';
    active = index;
    captions.forEach((caption, i) => {
      caption.classList.remove('is-current', 'is-leaving');
      caption.removeAttribute('aria-current');
      if (i === previous && previous >= 0) caption.classList.add('is-leaving');
      if (i === index) {
        caption.classList.add('is-current');
        caption.setAttribute('aria-current', 'step');
      }
    });
    cels.forEach((cel, i) => {
      cel.classList.toggle('is-current', i === index);
    });
  };

  const measure = () => {
    const view = viewport.getBoundingClientRect();
    const track = frames.getBoundingClientRect();
    const gate = view.width / 2;
    shifts = cels.map((cel) => {
      const box = cel.getBoundingClientRect();
      const local = box.left - track.left + box.width / 2;
      return gate - local;
    });
  };

  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    section.dataset.reelMode = 'pinned';
    measure();
    gsap.set(frames, { x: shifts[0] ?? 0, force3D: true });
    setCaption(0);

    const tween = gsap.fromTo(
      frames,
      { x: () => shifts[0] ?? 0 },
      {
        x: () => shifts[lastIndex] ?? 0,
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () =>
            `+=${Math.round(Math.abs((shifts[lastIndex] ?? 0) - (shifts[0] ?? 0)))}`,
          pin: true,
          pinType: 'fixed',
          scrub: true,
          snap:
            lastIndex > 0
              ? {
                  snapTo: 1 / lastIndex,
                  duration: 0.28,
                  delay: 0.06,
                  ease: 'power2.out',
                }
              : undefined,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefreshInit: measure,
          onUpdate: (self) => {
            section.style.setProperty('--sprocket', `${readX(frames)}px`);
            setCaption(Math.round(self.progress * lastIndex));
            section.classList.toggle('is-rolling', self.isActive);
          },
          onToggle: (self) => {
            section.classList.toggle('is-rolling', self.isActive);
          },
        },
      },
    );

    const refresh = () => ScrollTrigger.refresh();
    const images = Array.from(section.querySelectorAll('img'));
    images.forEach((image) => {
      if (!image.complete) image.addEventListener('load', refresh);
    });

    return () => {
      images.forEach((image) => image.removeEventListener('load', refresh));
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(frames, { clearProps: 'transform' });
      section.style.removeProperty('--sprocket');
      section.classList.remove('is-rolling');
      section.dataset.reelMode = 'free';
      active = -1;
      cels.forEach((cel) => cel.classList.remove('is-current'));
      captions.forEach((caption) => {
        caption.classList.remove('is-current', 'is-leaving');
        caption.removeAttribute('aria-current');
      });
      setCaption(0);
    };
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    section.dataset.reelMode = 'free';
    setCaption(0);
  }

  const revert = () => mm.revert();
  signal.addEventListener('abort', revert, { once: true });

  return revert;
}
