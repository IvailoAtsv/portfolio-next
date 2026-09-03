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
  const travel = compact ? 38 : 76;
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

  if (kind === 'action')
    return {
      duration: compact ? 320 : 400,
      frames: [
        { ...pose(0, '0px 6px', '0.98 0.97', -0.6 * direction), opacity: 0 },
        pose(0.68, '0px -1px', '1.008 1.008', 0.1 * direction),
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

  if (kind === 'cel') {
    const side = direction;
    return {
      duration: compact ? 620 : 780,
      frames: [
        { ...pose(0, `${-travel * side}px 0px`, '1 1'), opacity: 0 },
        pose(0.66, `${4 * side}px 0px`, '1 1'),
        pose(0.85, `${-1 * side}px 0px`, '1 1'),
        { ...rest, offset: 1 },
      ],
    };
  }

  return {
    duration: compact ? 300 : 360,
    frames: [
      {
        opacity: 0,
        translate: kind === 'detail' ? '-10px 0px' : '0px 14px',
        easing: out,
      },
      { opacity: 1, translate: '0px 0px' },
    ],
  };
}
