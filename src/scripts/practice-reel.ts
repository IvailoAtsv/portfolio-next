const clamp = (min: number, max: number, value: number) =>
  Math.min(max, Math.max(min, value));

const lerp = (from: number, to: number, amount: number) =>
  from + (to - from) * amount;

const FRAME_SMOOTH = 0.2;
const SNAP_IDLE_MS = 90;
const SNAP_THRESHOLD = 0.035;

export function initPracticeReel(signal: AbortSignal): () => void {
  const track = document.querySelector<HTMLElement>('[data-practice-track]');
  const section = document.querySelector<HTMLElement>('[data-practice-reel]');
  if (!track || !section) return () => {};

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
  let scrollAbort: AbortController | null = null;
  let loopId = 0;
  let snapTimer = 0;
  let settleTimer = 0;
  let snapping = false;
  let currentX = 0;

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

  const xAtProgress = (progress: number) => {
    if (lastIndex === 0) return shifts[0] ?? 0;
    const scaled = progress * lastIndex;
    const index = Math.min(lastIndex - 1, Math.floor(scaled));
    const fraction = scaled - index;
    return lerp(shifts[index] ?? 0, shifts[index + 1] ?? 0, fraction);
  };

  const scrollable = () => Math.max(0, track.offsetHeight - window.innerHeight);

  const progressInTrack = () => {
    const range = scrollable();
    if (range <= 0) return 0;
    return clamp(0, 1, -track.getBoundingClientRect().top / range);
  };

  const measure = () => {
    frames.style.transform = 'translate3d(0px, 0, 0)';
    const view = viewport.getBoundingClientRect();
    const trackBox = frames.getBoundingClientRect();
    const gate = view.width / 2;
    shifts = cels.map((cel) => {
      const box = cel.getBoundingClientRect();
      const local = box.left - trackBox.left + box.width / 2;
      return gate - local;
    });
    currentX = xAtProgress(progressInTrack());
    applyVisual(currentX, progressInTrack());
  };

  const frameProgress = (index: number) =>
    lastIndex === 0 ? 0 : index / lastIndex;

  const scrollYForProgress = (progress: number) =>
    track.offsetTop + progress * scrollable();

  const inReel = () => {
    const progress = progressInTrack();
    return progress > 0.001 && progress < 0.999;
  };

  const applyVisual = (x: number, progress: number) => {
    frames.style.transform = `translate3d(${x}px, 0, 0)`;
    section.style.setProperty('--sprocket', `${x}px`);
    setCaption(Math.min(lastIndex, Math.round(progress * lastIndex)));
    section.classList.toggle(
      'is-rolling',
      inReel() && Math.abs(x - xAtProgress(progress)) > 0.75,
    );
    section.classList.toggle('is-snapping', snapping);
  };

  const snapToFrame = (index: number) => {
    const target = frameProgress(index);
    const current = progressInTrack();
    if (Math.abs(current - target) < SNAP_THRESHOLD) return;

    snapping = true;
    section.classList.add('is-snapping');
    window.scrollTo({
      top: scrollYForProgress(target),
      behavior: 'smooth',
    });

    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(() => {
      snapping = false;
      section.classList.remove('is-snapping');
    }, 420);
  };

  const queueSnap = () => {
    if (snapping || !inReel()) return;
    window.clearTimeout(snapTimer);
    snapTimer = window.setTimeout(() => {
      if (snapping || !inReel()) return;
      const progress = progressInTrack();
      const frame = Math.min(lastIndex, Math.round(progress * lastIndex));
      snapToFrame(frame);
    }, SNAP_IDLE_MS);
  };

  const tick = () => {
    const progress = progressInTrack();
    const targetX = xAtProgress(progress);
    const blend = snapping ? 0.34 : FRAME_SMOOTH;
    currentX = lerp(currentX, targetX, blend);

    if (!snapping && Math.abs(currentX - targetX) < 0.45) {
      currentX = targetX;
    }

    applyVisual(currentX, progress);
    loopId = requestAnimationFrame(tick);
  };

  const onScroll = () => queueSnap();

  const onResize = () => {
    measure();
    queueSnap();
  };

  const enableScrollMode = () => {
    scrollAbort?.abort();
    scrollAbort = new AbortController();
    const scrollSignal = scrollAbort.signal;
    section.dataset.reelMode = 'scroll';
    measure();
    loopId = requestAnimationFrame(tick);
    window.addEventListener('scroll', onScroll, {
      passive: true,
      signal: scrollSignal,
    });
    window.addEventListener('resize', onResize, { signal: scrollSignal });
    const images = Array.from(section.querySelectorAll('img'));
    images.forEach((image) => {
      if (!image.complete) {
        image.addEventListener('load', onResize, { signal: scrollSignal });
      }
    });
  };

  const enableFreeMode = () => {
    scrollAbort?.abort();
    scrollAbort = null;
    window.clearTimeout(snapTimer);
    window.clearTimeout(settleTimer);
    cancelAnimationFrame(loopId);
    snapping = false;
    section.dataset.reelMode = 'free';
    section.classList.remove('is-rolling', 'is-snapping');
    frames.style.removeProperty('transform');
    section.style.removeProperty('--sprocket');
    setCaption(0);
  };

  const mm = window.matchMedia('(prefers-reduced-motion: no-preference)');
  const syncMode = () => {
    if (mm.matches) enableScrollMode();
    else enableFreeMode();
  };

  syncMode();
  mm.addEventListener('change', syncMode, { signal });

  return () => {
    scrollAbort?.abort();
    window.clearTimeout(snapTimer);
    window.clearTimeout(settleTimer);
    cancelAnimationFrame(loopId);
    frames.style.removeProperty('transform');
    section.style.removeProperty('--sprocket');
    section.classList.remove('is-rolling', 'is-snapping');
    section.dataset.reelMode = 'free';
    active = -1;
    cels.forEach((cel) => cel.classList.remove('is-current'));
    captions.forEach((caption) => {
      caption.classList.remove('is-current', 'is-leaving');
      caption.removeAttribute('aria-current');
    });
    setCaption(0);
  };
}
