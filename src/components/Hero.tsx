'use client';

import { motion } from 'framer-motion';
import CTAButton from '@/components/ui/CTAButton';

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(139, 92, 246, ${0.1 + i * 0.02})`, // Purple neon colors
    // Responsive width: thicker on mobile, thinner on desktop
    width: Math.max(1.5 + i * 0.05, 0.8 + i * 0.03),
  }));

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="h-full w-full text-purple-400/60"
        viewBox="0 0 696 316"
        fill="none"
      >
        {paths.map(path => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={`${path.width}px`}
            className="sm:stroke-[0.8] md:stroke-[0.6]"
            strokeOpacity={0.3 + path.id * 0.02}
            initial={{ pathLength: 0.4, opacity: 0.7 }}
            animate={{
              pathLength: 1,
              opacity: [0.5, 1, 0.5],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear',
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export default function Hero() {
  const greeting = 'Hi, my name is Ivaylo';
  const mainTitle = "I'm a Web Developer";
  const mainWords = mainTitle.split(' ');

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center md:px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="container mx-auto"
        >
          {/* Greeting */}
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-4 text-lg font-medium text-white sm:text-xl md:text-2xl"
          >
            {greeting}
          </motion.p>

          {/* Main Title */}
          <h1 className="mb-8 text-5xl leading-[0.85] font-black tracking-tight sm:text-7xl md:text-8xl lg:text-[7rem] xl:text-[9rem]">
            {mainWords.map((word, wordIndex) => (
              <span
                key={wordIndex}
                className="mr-3 inline-block last:mr-0 sm:mr-4"
              >
                {word.split('').map((letter, letterIndex) => (
                  <motion.span
                    key={`${wordIndex}-${letterIndex}`}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: 0.8 + wordIndex * 0.1 + letterIndex * 0.03,
                      type: 'spring',
                      stiffness: 150,
                      damping: 25,
                    }}
                    className="inline-block bg-gradient-to-br from-white via-purple-200 to-purple-500 bg-clip-text font-black text-transparent drop-shadow-sm"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="mx-auto mb-12 max-w-3xl text-lg text-gray-300 sm:text-xl md:text-2xl"
          >
            I specialize in building custom websites, e-commerce platforms,
            content management systems, and admin dashboards that give you
            complete control over your business.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8, duration: 0.8 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <CTAButton
              text="Contact Me"
              variant="filled"
              onClick={() => {
                document
                  .querySelector('#contact')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <CTAButton
              text="View My Work"
              variant="outlined"
              onClick={() => {
                document
                  .querySelector('#projects')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
