const out = 'cubic-bezier(0.16, 1, 0.3, 1)';
const into = 'cubic-bezier(0.55, 0, 0.85, 0.45)';

export type Performance = { frames: Keyframe[]; duration: number };

/** Anticipation, action, overshoot, recovery. Holds belong between gestures. */
export function performanceFor(
  kind: string,
  compact: boolean,
  baseAngle = 0,
  direction = 1,
): Performance {
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
      duration: compact ? 530 : 650,
      frames: [
        { ...pose(0, '0px 0.44em', '1.12 0.32', -7 * direction), opacity: 0 },
        pose(0.3, '0px -0.12em', '0.91 1.15', 2.5 * direction, into),
        pose(0.53, '0px 0.025em', '1.055 0.92', -1.2 * direction),
        pose(0.74, '0px -0.025em', '0.99 1.025', 0.4 * direction),
        { ...rest, offset: 1 },
      ],
    };

  // A button hops up from a crouch, stretches at the top, and lands with a
  // small squash. One gesture, but a lively one.
  if (kind === 'action')
    return {
      duration: compact ? 480 : 560,
      frames: [
        { ...pose(0, '0px 20px', '0.88 0.78', -2.5 * direction), opacity: 0 },
        {
          ...pose(0.46, '0px -7px', '1.035 1.07', 1.4 * direction),
          opacity: 1,
        },
        pose(0.7, '0px 2px', '1.025 0.955', -0.5 * direction),
        pose(0.86, '0px -1px', '0.995 1.012', 0.15 * direction),
        { ...rest, offset: 1 },
      ],
    };

  if (kind === 'stamp')
    return {
      duration: compact ? 440 : 560,
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

  // A picture is set down on the stand: it grows into place, overshoots a
  // touch, and settles. No sideways travel, no tilt.
  if (kind === 'cel')
    return {
      duration: compact ? 560 : 680,
      frames: [
        { ...pose(0, '0px 22px', '0.9 0.9'), opacity: 0 },
        { ...pose(0.44, '0px -4px', '1.03 1.03'), opacity: 1 },
        pose(0.72, '0px 1px', '0.992 0.992'),
        { ...rest, offset: 1 },
      ],
    };

  // A prop enters from off-stage on its side, overshoots past its mark, and
  // eases back onto it. The stage that holds it decides what happens next.
  if (kind === 'slide') {
    const from = -direction;
    return {
      duration: compact ? 820 : 960,
      frames: [
        { ...pose(0, `${72 * from}% 0px`, '1 1'), opacity: 0 },
        { ...pose(0.18, `${52 * from}% 0px`, '1 1'), opacity: 1 },
        pose(0.7, `${-2.4 * from}% 0px`, '1 1'),
        pose(0.88, `${0.7 * from}% 0px`, '1 1'),
        { ...rest, offset: 1 },
      ],
    };
  }

  // Chips, captions and facts pop a little rather than sliding in.
  if (kind === 'detail')
    return {
      duration: compact ? 320 : 380,
      frames: [
        { ...pose(0, '0px 8px', '0.94 0.94'), opacity: 0 },
        { ...pose(0.62, '0px -1px', '1.015 1.015'), opacity: 1 },
        { ...rest, offset: 1 },
      ],
    };

  return {
    duration: compact ? 300 : 360,
    frames: [
      { opacity: 0, translate: '0px 14px', easing: out },
      { opacity: 1, translate: '0px 0px' },
    ],
  };
}
