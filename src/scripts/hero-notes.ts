const randomBetween = (min: number, max: number) =>
  min + Math.random() * (max - min);

/** A small, reusable cast of notes lets the singer improvise without a loop. */
export function initHeroNotes(signal: AbortSignal): () => void {
  const stage = document.querySelector<HTMLElement>('.hero-stage');
  const layer = stage?.querySelector<HTMLElement>('.stage-notes');
  const notes = Array.from(
    layer?.querySelectorAll<SVGSVGElement>('.stage-note') ?? [],
  );
  if (!stage || !layer || !notes.length) return () => {};

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const flights = new Map<SVGSVGElement, Animation>();
  let timer: number | undefined;
  let visible = false;
  let disposed = false;

  const canPlay = () =>
    !disposed &&
    !signal.aborted &&
    visible &&
    !document.hidden &&
    !reducedMotion.matches;

  const stop = () => {
    window.clearTimeout(timer);
    timer = undefined;
    flights.forEach((flight) => {
      flight.onfinish = null;
      flight.cancel();
    });
    flights.clear();
  };

  const releaseNote = () => {
    const available = notes.filter((note) => !flights.has(note));
    const note = available[Math.floor(Math.random() * available.length)];
    if (!note) return;

    const { width, height } = stage.getBoundingClientRect();
    const headroom = Number.parseFloat(
      getComputedStyle(layer).getPropertyValue('--note-headroom'),
    );
    // Start near the microphone, then rise into the space above the picture.
    // A shallow mobile ceiling keeps the notes clear of the headline.
    const originX = width * randomBetween(0.55, 0.76);
    const originY = height * randomBetween(0.18, 0.3);
    const rise = originY + randomBetween(headroom * 0.65, headroom);
    const drift = width * randomBetween(-0.13, 0.15);
    const sway = width * randomBetween(-0.04, 0.04);
    const rotation = randomBetween(-16, 12);
    const turn = randomBetween(-20, 22);
    const size = randomBetween(0.72, 1.15);
    const offsets = [0, 0.18, 0.55, 0.82, 1];
    const opacity = [0, 0.88, 0.9, 0.68, 0];
    const scale = [0.68, 0.94, 1, 1.03, 0.96];

    const keyframes = offsets.map((progress, index) => {
      const arc = Math.sin(progress * Math.PI);
      const x = Math.min(
        width - 52,
        Math.max(width * 0.32, originX + drift * progress + sway * arc),
      );
      const y = originY - rise * (1 - (1 - progress) ** 1.4);
      const angle = rotation + turn * progress + arc * 6;
      return {
        offset: progress,
        opacity: opacity[index],
        transform: `translate(${x}px, ${y}px) rotate(${angle}deg) scale(${size * scale[index]})`,
      };
    });

    const flight = note.animate(keyframes, {
      duration: randomBetween(3000, 4300),
      easing: 'linear',
    });
    flights.set(note, flight);
    flight.onfinish = () => {
      flights.delete(note);
      flight.cancel();
    };
  };

  const schedule = (delay: number) => {
    timer = window.setTimeout(() => {
      timer = undefined;
      if (!canPlay()) return;
      releaseNote();
      // Occasional close pairs feel sung, without turning into a particle shower.
      schedule(
        Math.random() < 0.18
          ? randomBetween(300, 440)
          : randomBetween(700, 1100),
      );
    }, delay);
  };

  const syncPlayback = () => {
    stop();
    if (canPlay()) schedule(randomBetween(450, 800));
  };

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncPlayback();
  });
  observer.observe(stage);
  document.addEventListener('visibilitychange', syncPlayback, { signal });
  reducedMotion.addEventListener('change', syncPlayback, { signal });
  window.addEventListener('resize', syncPlayback, { signal, passive: true });

  return () => {
    disposed = true;
    stop();
    observer.disconnect();
  };
}
