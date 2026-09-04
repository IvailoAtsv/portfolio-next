const clamp = (min: number, max: number, value: number) =>
  Math.min(max, Math.max(min, value));

/**
 * The practice reel is a native horizontal scroller with snap points. This
 * only keeps the caption, arrow state and sprocket holes in step with wherever
 * the visitor has wound the film to.
 */
export function initPracticeReel(signal: AbortSignal): () => void {
  const section = document.querySelector<HTMLElement>('[data-practice-reel]');
  if (!section) return () => {};

  const viewport = section.querySelector<HTMLElement>('.practice-viewport');
  const cels = Array.from(
    section.querySelectorAll<HTMLElement>('.practice-cel'),
  );
  const captions = Array.from(
    section.querySelectorAll<HTMLElement>('.practice-captions li'),
  );
  const prev = section.querySelector<HTMLButtonElement>('[data-reel-prev]');
  const next = section.querySelector<HTMLButtonElement>('[data-reel-next]');

  if (!viewport || cels.length === 0) return () => {};

  const lastIndex = cels.length - 1;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active = -1;
  let frame = 0;

  const setActive = (index: number) => {
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
    cels.forEach((cel, i) => cel.classList.toggle('is-current', i === index));

    prev?.setAttribute('aria-disabled', String(index === 0));
    next?.setAttribute('aria-disabled', String(index === lastIndex));
  };

  // The cel whose centre is nearest the middle of the gate.
  const nearestIndex = () => {
    const gate = viewport.scrollLeft + viewport.clientWidth / 2;
    let best = 0;
    let bestDistance = Infinity;
    cels.forEach((cel, i) => {
      const distance = Math.abs(cel.offsetLeft + cel.offsetWidth / 2 - gate);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = i;
      }
    });
    return best;
  };

  const sync = () => {
    frame = 0;
    section.style.setProperty('--sprocket', `${-viewport.scrollLeft}px`);
    setActive(nearestIndex());
  };

  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(sync);
  };

  const scrollToIndex = (index: number) => {
    const cel = cels[clamp(0, lastIndex, index)];
    if (!cel) return;
    viewport.scrollTo({
      left: cel.offsetLeft - (viewport.clientWidth - cel.offsetWidth) / 2,
      behavior: reduced.matches ? 'auto' : 'smooth',
    });
  };

  const step = (delta: number) => {
    const target = active + delta;
    if (target < 0 || target > lastIndex) return;
    scrollToIndex(target);
  };

  prev?.addEventListener('click', () => step(-1), { signal });
  next?.addEventListener('click', () => step(1), { signal });

  viewport.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        step(1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        step(-1);
      }
    },
    { signal },
  );

  viewport.addEventListener('scroll', onScroll, { passive: true, signal });
  window.addEventListener('resize', onScroll, { signal });

  sync();

  return () => {
    cancelAnimationFrame(frame);
    frame = 0;
    section.style.removeProperty('--sprocket');
    delete section.dataset.reelDir;
    active = -1;
    cels.forEach((cel) => cel.classList.remove('is-current'));
    captions.forEach((caption) => {
      caption.classList.remove('is-current', 'is-leaving');
      caption.removeAttribute('aria-current');
    });
  };
}
