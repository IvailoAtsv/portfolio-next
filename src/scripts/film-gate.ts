const gate = document.querySelector<HTMLElement>('.film-gate')!;
const title = gate.querySelector<HTMLElement>('[data-transition-title]')!;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let run = new AbortController();

const gateMs = (token: string, fallback: number) => {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim()
    .toLowerCase();
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  // Production CSS can shorten 720ms to .72s; timers always need ms.
  if (value.endsWith('ms')) return parsed;
  if (value.endsWith('s')) return parsed * 1000;
  return fallback;
};

const wait = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve) => {
    if (signal.aborted) return resolve();
    const finish = () => {
      clearTimeout(timer);
      signal.removeEventListener('abort', finish);
      resolve();
    };
    const timer = window.setTimeout(finish, ms);
    signal.addEventListener('abort', finish, { once: true });
  });

const afterPaint = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });

const startRun = () => {
  run.abort();
  run = new AbortController();
  return run;
};

const openGate = async (signal: AbortSignal) => {
  if (!reducedMotion.matches) await afterPaint();
  if (signal.aborted) return;
  document.body.classList.add('is-ready');
  gate.dataset.state = 'open';
};

const gateAnimations = () => {
  try {
    return gate.getAnimations({ subtree: true });
  } catch {
    return typeof gate.getAnimations === 'function' ? gate.getAnimations() : [];
  }
};

const coverPage = async (signal: AbortSignal) => {
  if (reducedMotion.matches) return;
  // Read the real CSS transitions, including reversals of a partial opening.
  // This starts alongside the fetch and never delays its start.
  await afterPaint();
  if (signal.aborted) return;
  const closeMs = gateMs('--gate-close', 420);
  await Promise.race([
    Promise.allSettled(gateAnimations().map((animation) => animation.finished)),
    wait(closeMs + 80, signal),
  ]);
  if (signal.aborted) return;
  await wait(gateMs('--gate-hold-nav', 160), signal);
};

const firstEntrance = async () => {
  const { signal } = run;
  if (!reducedMotion.matches) {
    await afterPaint();
    await wait(gateMs('--gate-hold-first', 720), signal);
  }
  await openGate(signal);
};

document.addEventListener('astro:before-preparation', (event) => {
  const current = startRun();
  event.signal.addEventListener(
    'abort',
    () => {
      current.abort();
      // An in-page anchor can cancel a pending route without starting a new
      // preparation. Reopen unless another navigation has already taken over.
      queueMicrotask(() => {
        if (run === current) void openGate(startRun().signal);
      });
    },
    { once: true },
  );
  title.textContent = (
    event.sourceElement?.getAttribute('data-transition-label') ||
    (event.to.pathname.includes('/work/') ? 'The case file' : 'The main reel')
  ).toLocaleUpperCase('en-US');
  gate.dataset.state = 'closed';

  const load = event.loader;
  event.loader = async () => {
    // Invoke Astro's loader immediately: fetch and shutter travel overlap.
    // Astro owns redirects, request cancellation, history, and stylesheet loading.
    try {
      await Promise.all([load(), coverPage(current.signal)]);
    } catch (error) {
      void openGate(current.signal);
      throw error;
    }
  };
});

document.addEventListener('astro:before-swap', (event) => {
  // The persistent gate is the only transition. A browser snapshot/crossfade
  // would freeze it during the swap and produce a second visual handoff.
  void event.viewTransition.ready.catch(() => {});
  event.viewTransition.skipTransition();
  event.newDocument.documentElement.classList.add('js');
});

document.addEventListener('astro:after-swap', () => {
  // The same closed gate survives the swap, including its title and CSS state.
  // There is no second arrival timer or new document flash.
  void openGate(run.signal);
});

window.addEventListener('pageshow', (event) => {
  if (event.persisted) void openGate(startRun().signal);
});

reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) void openGate(run.signal);
});

void firstEntrance().catch(() => {
  document.body.classList.add('is-ready');
  gate.dataset.state = 'open';
});
