const out = 'cubic-bezier(0.16, 1, 0.3, 1)';
const into = 'cubic-bezier(0.55, 0, 0.85, 0.45)';

export type Performance = { frames: Keyframe[]; duration: number };

/**
 * Anticipation, action, overshoot, recovery. Holds belong between gestures.
 * `direction` is 1 when the actor enters from the left and -1 from the right;
 * `start` is the signed distance in px that puts it fully off-screen.
 */
export function performanceFor(
  kind: string,
  compact: boolean,
  baseAngle = 0,
  direction = 1,
  start = (compact ? -420 : -760) * direction,
): Performance {
  const back = -Math.sign(start) || -direction;
  const rest = {
    opacity: 1,
    translate: '0px 0px',
    scale: '1 1',
    rotate: `${baseAngle}deg`,
  };
  const pose = (
    offset: number,
    translate: string,
    scale: string,
    angle = 0,
    easing = out,
  ): Keyframe => ({
    ...rest,
    offset,
    translate,
    scale,
    rotate: `${baseAngle + angle}deg`,
    easing,
  });

  if (kind === 'title')
    return {
      duration: compact ? 460 : 560,
      frames: [
        { ...pose(0, '0px 0.44em', '1.12 0.32', -7 * direction), opacity: 0 },
        pose(0.3, '0px -0.12em', '0.91 1.15', 2.5 * direction, into),
        pose(0.53, '0px 0.025em', '1.055 0.92', -1.2 * direction),
        pose(0.74, '0px -0.025em', '0.99 1.025', 0.4 * direction),
        { ...rest, offset: 1 },
      ],
    };

  // A button skids in from the edge of the screen leaning into its travel,
  // slides a little past its mark with a brief squash, and settles back.
  if (kind === 'action')
    return {
      duration: compact ? 450 : 520,
      frames: [
        pose(0, `${start}px 0px`, '1 1', 3 * direction),
        pose(0.66, `${12 * back}px 0px`, '1.035 0.965', -0.9 * direction),
        pose(0.84, `${-3 * back}px 0px`, '0.995 1.006', 0.25 * direction),
        { ...rest, offset: 1 },
      ],
    };

  if (kind === 'stamp')
    return {
      duration: compact ? 380 : 480,
      frames: [
        {
          ...pose(0, '0px -24px', '0.78 1.15', -8 * direction, into),
          opacity: 0,
        },
        pose(0.38, '0px 3px', '1.15 0.78', 2.2 * direction),
        pose(0.64, '0px -5px', '0.96 1.06', -1.2 * direction, into),
        pose(0.83, '0px 1px', '1.02 0.98', 0.35 * direction),
        { ...rest, offset: 1 },
      ],
    };

  // Same squash-stretch family as the titles: whoosh in, plant, rebound.
  // The picture arrives on the title's 0.3 beat so the two read as one scene.
  // Extra off-stage clearance covers the opening smear (origin is centred).
  if (kind === 'cel') {
    const over = compact ? 16 : 26;
    const from =
      start + (Math.sign(start) || -direction) * (compact ? 56 : 88);
    return {
      duration: compact ? 480 : 580,
      frames: [
        pose(0, `${from}px 0.28em`, compact ? '1.14 0.78' : '1.18 0.7', -7 * direction),
        pose(
          0.3,
          `${over * back}px -0.1em`,
          compact ? '0.9 1.12' : '0.86 1.16',
          2.5 * direction,
          into,
        ),
        pose(0.53, `${-over * 0.28 * back}px 0.03em`, '1.06 0.92', -1.2 * direction),
        pose(0.74, `${over * 0.08 * back}px -0.02em`, '0.99 1.025', 0.4 * direction),
        { ...rest, offset: 1 },
      ],
    };
  }

  // A prop glides on from off-stage in one decelerating move. Segmented
  // ease-outs stacked here used to kick the velocity at each key, which
  // read as a choppy slide on the contact hand.
  if (kind === 'slide') {
    return {
      duration: compact ? 760 : 920,
      frames: [
        {
          ...pose(0, `${start}px 0px`, '1 1'),
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        },
        { ...rest, offset: 1 },
      ],
    };
  }

  // Chips, captions and facts pop a little rather than sliding in.
  if (kind === 'detail')
    return {
      duration: compact ? 270 : 320,
      frames: [
        { ...pose(0, '0px 8px', '0.94 0.94'), opacity: 0 },
        { ...pose(0.62, '0px -1px', '1.015 1.015'), opacity: 1 },
        { ...rest, offset: 1 },
      ],
    };

  return {
    duration: compact ? 250 : 300,
    frames: [
      { opacity: 0, translate: '0px 14px', easing: out },
      { opacity: 1, translate: '0px 0px' },
    ],
  };
}
