import React from 'react';

/**
 * WaveDivider Component
 * Renders dynamically rolling, continuous organic SVG waves between sections.
 * Tri-layer depth with opposite flowing movements (60fps GPU acceleration).
 * Overlaps adjacent section by 3px to completely eliminate any subpixel straight line seams.
 */
export default function WaveDivider({
  fromBg = '',
  toColor = 'text-white dark:text-[#0B130E]',
  accentColor = 'text-tea-mint/35 dark:text-tea-mint/25',
  secondaryAccent = 'text-tea-leaf/30 dark:text-tea-leaf/20',
  height = 'h-16 sm:h-20 md:h-24 lg:h-28',
  flipX = false,
  inverted = false,
  className = ''
}) {
  return (
    <div
      className={`relative w-full overflow-hidden leading-none pointer-events-none select-none z-10 -mb-[3px] ${height} ${fromBg} ${
        inverted ? 'rotate-180' : ''
      } ${flipX ? '-scale-x-100' : ''} ${className}`}
      aria-hidden="true"
    >
      {/* Layer 1: Ambient soft wave (Flowing forward, slow & majestic) */}
      <div className="absolute inset-0 w-[200%] flex animate-wave-flow-1">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-1/2 h-[calc(100%+8px)] shrink-0 block -mt-1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 0,55 C 100,15 300,95 400,55 C 500,15 700,95 800,55 C 900,15 1100,95 1200,55 L 1200,160 L 0,160 Z"
            className={`fill-current ${secondaryAccent}`}
          />
        </svg>
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-1/2 h-[calc(100%+8px)] shrink-0 block -mt-1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 0,55 C 100,15 300,95 400,55 C 500,15 700,95 800,55 C 900,15 1100,95 1200,55 L 1200,160 L 0,160 Z"
            className={`fill-current ${secondaryAccent}`}
          />
        </svg>
      </div>

      {/* Layer 2: Mid-tier glowing accent wave (Flowing in reverse, creating organic wave interplay) */}
      <div className="absolute inset-0 w-[200%] flex animate-wave-flow-2">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-1/2 h-[calc(100%+8px)] shrink-0 block -mt-1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 0,45 C 150,75 450,15 600,45 C 750,75 1050,15 1200,45 L 1200,160 L 0,160 Z"
            className={`fill-current ${accentColor}`}
          />
        </svg>
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-1/2 h-[calc(100%+8px)] shrink-0 block -mt-1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 0,45 C 150,75 450,15 600,45 C 750,75 1050,15 1200,45 L 1200,160 L 0,160 Z"
            className={`fill-current ${accentColor}`}
          />
        </svg>
      </div>

      {/* Layer 3: Foreground solid wave matching destination section (Active rolling wave, overlaps next section) */}
      <div className="absolute inset-0 w-[200%] flex animate-wave-flow-3">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-1/2 h-[calc(100%+8px)] shrink-0 block -mt-1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 0,68 C 150,35 450,100 600,68 C 750,35 1050,100 1200,68 L 1200,160 L 0,160 Z"
            className={`fill-current ${toColor}`}
          />
        </svg>
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-1/2 h-[calc(100%+8px)] shrink-0 block -mt-1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 0,68 C 150,35 450,100 600,68 C 750,35 1050,100 1200,68 L 1200,160 L 0,160 Z"
            className={`fill-current ${toColor}`}
          />
        </svg>
      </div>
    </div>
  );
}
