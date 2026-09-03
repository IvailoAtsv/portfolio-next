import { performanceFor } from './motion-cues';

type MotionElement = HTMLElement | SVGElement;
type Cue = {
  element: MotionElement;
  group: Element;
  kind: string;
  order: number;
  visible: boolean;
  played: boolean;
  animations: Animation[];
};

const order: Record<string, number> = {
  title: 0,
  copy: 1,
  action: 2,
  detail: 3,
  cel: 3,
  line: 3,
  stamp: 4,
};
const ease = 'cubic-bezier(0.16, 1, 0.3, 1)';

const prepareWords = (heading: Element) => {
  if (heading.querySelector('.motion-word')) return;
  const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  nodes.forEach((node) => {
    if (!node.textContent?.trim()) return;
    const fragment = document.createDocumentFragment();
    node.textContent.split(/(\s+)/).forEach((word) => {
      if (!word.trim()) fragment.append(document.createTextNode(word));
      else {
        const span = document.createElement('span');
        span.className = 'motion-word';
        span.textContent = word;
        fragment.append(span);
      }
    });
    node.replaceWith(fragment);
  });
};

/** Each scene has a reading order; only the cues actually on screen join it. */
export function initMotion(signal: AbortSignal): () => void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compact = window.matchMedia('(max-width: 1024px)');
  const cues: Cue[] = Array.from(
    document.querySelectorAll<MotionElement>('[data-motion]'),
    (element) => ({
      element,
      group: element.closest('[data-motion-group]') ?? element,
      kind: element.dataset.motion ?? 'detail',
      order: Number(
        element.dataset.motionOrder ??
          order[element.dataset.motion ?? 'detail'] ??
          3,
      ),
      visible: false,
      played: false,
      animations: [],
    }),
  );
  const loops = Array.from(
    document.querySelectorAll<HTMLElement>('[data-loop]:not(.hero-stage)'),
  );
  const liveLoops = new Set<Element>();
  const groupClocks = new Map<Element, number>();
  let ready = false;
  let frame = 0;
  let readyTimer = 0;

  const finish = (cue: Cue) => {
    cue.played = true;
    cue.element.dataset.motionState = 'done';
    cue.animations.forEach((animation) => animation.cancel());
    cue.animations = [];
  };

  const play = (cue: Cue, delay: number) => {
    cue.played = true;
    cue.element.style.setProperty('--motion-delay', `${delay}ms`);
    cue.element.dataset.motionState = 'running';
    const words =
      cue.kind === 'title'
        ? Array.from(cue.element.querySelectorAll<HTMLElement>('.motion-word'))
        : [];
    const wires =
      cue.kind === 'line'
        ? Array.from(
            cue.element.querySelectorAll<SVGPathElement>('.system-wire'),
          )
        : [];
    const actors = wires.length ? wires : words.length ? words : [cue.element];
    const short = compact.matches;
    const side =
      cue.element.dataset.motionSide === 'right' ||
      cue.element.closest('.reel-project:nth-child(even)')
        ? -1
        : 1;

    actors.forEach((actor, index) => {
      const angle = Number.parseFloat(getComputedStyle(actor).rotate) || 0;
      const performance = performanceFor(
        cue.kind,
        short,
        angle,
        index % 2 ? -side : side,
      );
      let stagger = words.length ? Math.min(index * (short ? 38 : 48), 240) : 0;
      if (wires.length && actor instanceof SVGPathElement) {
        const length = actor.getTotalLength();
        performance.frames = [
          {
            strokeDasharray: `${length} ${length}`,
            strokeDashoffset: length,
            opacity: 0,
            easing: ease,
          },
          {
            strokeDasharray: `${length} ${length}`,
            strokeDashoffset: 0,
            opacity: 1,
          },
        ];
        performance.duration = 380;
        stagger = index * 120;
      }
      cue.animations.push(
        actor.animate(performance.frames, {
          duration: performance.duration,
          delay: delay + stagger,
          easing: 'linear',
          fill: 'both',
        }),
      );
    });

    // A separate, delayed seal catches up to the frame's landing and rebounds.
    const seal = cue.element.querySelector<HTMLElement>('.reel-seal');
    if (cue.kind === 'cel' && seal) {
      cue.animations.push(
        seal.animate(
          [
            {
              opacity: 0,
              translate: '0px -36px',
              scale: '0.7 1.2',
              rotate: '-22deg',
              easing: ease,
            },
            {
              offset: 0.48,
              opacity: 1,
              translate: '0px 4px',
              scale: '1.14 0.84',
              rotate: '12deg',
              easing: ease,
            },
            {
              offset: 0.73,
              opacity: 1,
              translate: '0px -5px',
              scale: '0.96 1.04',
              rotate: '-5deg',
              easing: ease,
            },
            { opacity: 1, translate: '0px 0px', scale: '1 1', rotate: '0deg' },
          ],
          {
            duration: short ? 560 : 720,
            delay: delay + (short ? 300 : 410),
            fill: 'both',
          },
        ),
      );
    }

    void Promise.allSettled(
      cue.animations.map((animation) => animation.finished),
    ).then(() => {
      if (!signal.aborted) finish(cue);
    });
  };

  const flush = () => {
    frame = 0;
    if (!ready || document.hidden || reduced.matches || signal.aborted) return;
    const now = performance.now();
    const groups = new Map<Element, Cue[]>();
    cues
      .filter((cue) => cue.visible && !cue.played)
      .forEach((cue) => {
        const batch = groups.get(cue.group) ?? [];
        batch.push(cue);
        groups.set(cue.group, batch);
      });
    groups.forEach((batch, group) => {
      const parent = group.parentElement?.closest('[data-motion-group]');
      // Child beats wait for their section's headline, even when all are visible.
      let cursor = Math.max(
        now,
        groupClocks.get(group) ?? now,
        parent ? (groupClocks.get(parent) ?? now) : now,
      );
      const siblings = group.parentElement?.children;
      const siblingIndex = siblings ? Array.from(siblings).indexOf(group) : 0;
      if (
        group.matches(
          '.practice-beat, .decision-row > div, .decision-ledger > div',
        )
      ) {
        cursor += Math.min(siblingIndex, 3) * 130;
      }
      cursor = Math.min(cursor, now + 900);
      if (group instanceof HTMLElement)
        group.style.setProperty('--motion-group-delay', `${cursor - now}ms`);
      batch
        .sort((a, b) => a.order - b.order)
        .forEach((cue) => {
          // Preserve each title/copy pair even when a nested scene joins late.
          play(cue, cursor - now);
          const wordCount = cue.element.querySelectorAll('.motion-word').length;
          const titleLead =
            (compact.matches ? 480 : 570) +
            Math.min(Math.max(0, wordCount - 1) * 32, 170);
          cursor +=
            cue.kind === 'title'
              ? titleLead
              : cue.kind === 'copy'
                ? 210
                : cue.kind === 'line'
                  ? 380
                  : cue.element.classList.contains('node-catalog')
                    ? 440
                    : cue.group.classList.contains('system-map')
                      ? 120
                      : cue.kind === 'cel'
                        ? 180
                        : 90;
        });
      groupClocks.set(group, cursor);
    });
  };
  const queue = () => {
    if (!frame) frame = requestAnimationFrame(flush);
  };
  const syncLoops = () => {
    const canPlay = ready && !document.hidden && !reduced.matches;
    document.body.classList.toggle('motion-paused', !canPlay);
    loops.forEach((loop) =>
      loop.classList.toggle('is-live', canPlay && liveLoops.has(loop)),
    );
  };

  // No stylesheet hides content until this controller has successfully started.
  const supported =
    'IntersectionObserver' in window && 'animate' in Element.prototype;
  if (!supported) {
    cues.forEach(finish);
    document.body.classList.add('motion-paused');
    return () => {};
  }
  cues
    .filter((cue) => cue.kind === 'title')
    .forEach((cue) => prepareWords(cue.element));
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // A connected diagram is one scene: hub, outgoing wires, then endpoints.
        // Its SVG box can enter before the centered hub, so observe the map itself.
        if (entry.target.classList.contains('system-map')) {
          const scene = cues.filter((cue) => cue.group === entry.target);
          scene.forEach((cue) => {
            cue.visible = entry.isIntersecting;
            if (!entry.isIntersecting && entry.boundingClientRect.bottom < 0)
              finish(cue);
          });
          if (scene.every((cue) => cue.played))
            revealObserver.unobserve(entry.target);
          return;
        }
        const cue = cues.find((item) => item.element === entry.target);
        if (!cue) return;
        cue.visible = entry.isIntersecting;
        // Anchor jumps, history restoration and fast scrolling expose skipped copy.
        if (!entry.isIntersecting && entry.boundingClientRect.bottom < 0)
          finish(cue);
        if (cue.played) revealObserver.unobserve(cue.element);
      });
      queue();
    },
    { threshold: 0, rootMargin: '0px 0px -4% 0px' },
  );
  const loopObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) liveLoops.add(entry.target);
        else liveLoops.delete(entry.target);
      });
      syncLoops();
    },
    { threshold: 0 },
  );

  cues.forEach((cue) => {
    if (reduced.matches) finish(cue);
    else cue.element.dataset.motionState = 'pending';
    revealObserver.observe(
      cue.group.classList.contains('system-map') ? cue.group : cue.element,
    );
  });
  loops.forEach((loop) => loopObserver.observe(loop));

  // Follow the existing gate without changing any hero choreography or timing.
  const awaitGate = () => {
    if (ready || readyTimer || !document.body.classList.contains('is-ready'))
      return;
    readyTimer = window.setTimeout(
      () => {
        ready = true;
        syncLoops();
        queue();
      },
      reduced.matches ? 0 : 740,
    );
  };
  const gateObserver = new MutationObserver(awaitGate);
  gateObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ['class'],
  });
  awaitGate();
  // A failed gate signal must never strand the rest of the page at opacity zero.
  const failOpen = window.setTimeout(() => {
    if (!ready) {
      ready = true;
      cues.filter((cue) => cue.visible).forEach(finish);
      syncLoops();
      queue();
    }
  }, 3500);
  document.addEventListener(
    'visibilitychange',
    () => {
      // Finish entrances rather than resume a half-read sentence after a tab switch.
      if (document.hidden) {
        cues.filter((cue) => cue.played).forEach(finish);
      }
      syncLoops();
      queue();
    },
    { signal },
  );
  reduced.addEventListener(
    'change',
    () => {
      if (reduced.matches) {
        cues.forEach(finish);
      }
      syncLoops();
      queue();
    },
    { signal },
  );
  document.addEventListener(
    'focusin',
    (event) => {
      if (!(event.target instanceof Element)) return;
      const target = event.target;
      cues.filter((cue) => cue.element.contains(target)).forEach(finish);
    },
    { signal },
  );

  syncLoops();
  queue();

  return () => {
    cancelAnimationFrame(frame);
    clearTimeout(readyTimer);
    clearTimeout(failOpen);
    gateObserver.disconnect();
    revealObserver.disconnect();
    loopObserver.disconnect();
    cues.forEach(finish);
    loops.forEach((loop) => loop.classList.remove('is-live'));
    groupClocks.clear();
  };
}
