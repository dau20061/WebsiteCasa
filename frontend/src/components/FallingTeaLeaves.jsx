import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { Leaf } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

/**
 * Botanical Tea Leaf Variations and Color Palettes
 */
const LEAF_PALETTES = [
  // 1. Signature Casa Tea & Mint
  {
    light: { tip: '#34d399', body: '#10b981', base: '#047857' },
    dark: { tip: '#6ee7b7', body: '#27858d', base: '#064e3b' },
  },
  // 2. Spring First Flush
  {
    light: { tip: '#86efac', body: '#22c55e', base: '#15803d' },
    dark: { tip: '#a7f3d0', body: '#10b981', base: '#065f46' },
  },
  // 3. Golden Roasted Oolong
  {
    light: { tip: '#bef264', body: '#65a30d', base: '#3f6212' },
    dark: { tip: '#d9f99d', body: '#84cc16', base: '#365314' },
  },
];

/**
 * Pre-render an offscreen sprite canvas for each leaf configuration
 * This avoids calculating gradients and bezier curves on every frame (60fps).
 */
function createLeafSprite(variant, paletteIdx, isDark, isTopSide, size = 64) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const halfLen = size * 0.42;
  const width = size * 0.32;
  const palette = LEAF_PALETTES[paletteIdx % LEAF_PALETTES.length];
  const colors = isDark ? palette.dark : palette.light;

  ctx.translate(size / 2, size / 2);

  // Gradient fill depending on side
  const grad = ctx.createLinearGradient(0, -halfLen, 0, halfLen);
  if (isTopSide) {
    grad.addColorStop(0, colors.tip);
    grad.addColorStop(0.55, colors.body);
    grad.addColorStop(1, colors.base);
  } else {
    grad.addColorStop(0, isDark ? '#a7f3d0' : '#bbf7d0');
    grad.addColorStop(0.6, isDark ? '#34d399' : '#4ade80');
    grad.addColorStop(1, isDark ? '#059669' : '#16a34a');
  }

  // Botanical Leaf Outline
  ctx.beginPath();
  if (variant === 1) {
    // S-curve wind-blown leaf
    ctx.moveTo(width * 0.2, -halfLen);
    ctx.bezierCurveTo(-width * 1.25, -halfLen * 0.35, -width * 0.85, halfLen * 0.35, 0, halfLen);
    ctx.bezierCurveTo(width * 0.9, halfLen * 0.4, width * 1.3, -halfLen * 0.25, width * 0.2, -halfLen);
  } else if (variant === 2) {
    // Slender tender bud
    ctx.moveTo(0, -halfLen);
    ctx.bezierCurveTo(-width * 0.9, -halfLen * 0.3, -width * 0.7, halfLen * 0.4, 0, halfLen);
    ctx.bezierCurveTo(width * 0.7, halfLen * 0.4, width * 0.9, -halfLen * 0.3, 0, -halfLen);
  } else {
    // Classic lanceolate tea leaf
    ctx.moveTo(0, -halfLen);
    ctx.bezierCurveTo(-width * 1.15, -halfLen * 0.3, -width * 0.95, halfLen * 0.35, 0, halfLen);
    ctx.bezierCurveTo(width * 0.95, halfLen * 0.35, width * 1.15, -halfLen * 0.3, 0, -halfLen);
  }
  ctx.closePath();

  ctx.fillStyle = grad;
  ctx.fill();

  // Central Vein
  ctx.beginPath();
  ctx.moveTo(0, halfLen + size * 0.05);
  ctx.quadraticCurveTo(width * 0.06, 0, 0, -halfLen + size * 0.04);
  ctx.strokeStyle = isDark
    ? (isTopSide ? 'rgba(167, 243, 208, 0.5)' : 'rgba(110, 231, 183, 0.35)')
    : (isTopSide ? 'rgba(255, 255, 255, 0.55)' : 'rgba(187, 247, 208, 0.4)');
  ctx.lineWidth = Math.max(1, size * 0.03);
  ctx.stroke();

  return canvas;
}

/**
 * Generate randomized tea leaves
 */
function createTeaLeaves(count, width, height) {
  const leaves = [];
  for (let i = 0; i < count; i++) {
    const layerRand = Math.random();
    const layer = layerRand < 0.35 ? 'back' : layerRand < 0.85 ? 'mid' : 'front';

    let size, speedY, opacity;
    if (layer === 'back') {
      size = 16 + Math.random() * 8;
      speedY = 0.5 + Math.random() * 0.4;
      opacity = 0.38 + Math.random() * 0.2;
    } else if (layer === 'mid') {
      size = 24 + Math.random() * 8;
      speedY = 0.85 + Math.random() * 0.45;
      opacity = 0.65 + Math.random() * 0.2;
    } else {
      size = 32 + Math.random() * 10;
      speedY = 1.3 + Math.random() * 0.6;
      opacity = 0.85 + Math.random() * 0.15;
    }

    leaves.push({
      id: i,
      layer,
      variant: Math.floor(Math.random() * 3),
      paletteIdx: Math.floor(Math.random() * LEAF_PALETTES.length),
      x: Math.random() * width,
      y: Math.random() * height,
      size,
      speedY,
      swayPhase: Math.random() * Math.PI * 2,
      swaySpeed: 0.015 + Math.random() * 0.018,
      swayAmplitude: 0.8 + Math.random() * 1.2,
      angleZ: Math.random() * Math.PI * 2,
      spinZSpeed: (Math.random() - 0.5) * 0.015,
      flipX: Math.random() * Math.PI * 2,
      flipXSpeed: 0.012 + Math.random() * 0.018,
      flipY: Math.random() * Math.PI * 2,
      flipYSpeed: 0.008 + Math.random() * 0.012,
      opacity,
    });
  }
  return leaves;
}

function FallingTeaLeaves({
  count: customCount,
  className = '',
  showToggle = true,
}) {
  const canvasRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const leavesRef = useRef([]);
  const mouseWindRef = useRef(0);
  const targetWindRef = useRef(0);
  const lastMousePosRef = useRef({ x: 0, y: 0, time: 0 });
  const spritesRef = useRef(new Map());
  const { isChinese } = useLanguage();

  // Toggle state with localStorage persistence
  const [isEnabled, setIsEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('casa_tea_leaves_effect');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : false
  );

  const toggleEffect = useCallback(() => {
    setIsEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('casa_tea_leaves_effect', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Listen to dark mode toggle
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  // Pre-generate leaf sprites whenever theme changes
  useEffect(() => {
    const map = new Map();
    for (let variant = 0; variant < 3; variant++) {
      for (let pal = 0; pal < LEAF_PALETTES.length; pal++) {
        map.set(variant + '-' + pal + '-' + isDark + '-top', createLeafSprite(variant, pal, isDark, true));
        map.set(variant + '-' + pal + '-' + isDark + '-bottom', createLeafSprite(variant, pal, isDark, false));
      }
    }
    spritesRef.current = map;
  }, [isDark]);

  // Main Canvas animation loop with scroll-pause & sprite blitting
  useEffect(() => {
    if (!isEnabled) {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    // Cap DPR to 1.25 for massive GPU fill-rate boost on high-DPI displays
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();

    // Balanced leaf counts: mobile 10, tablet 14, desktop 18
    const leafCount =
      customCount || (width < 768 ? 10 : width < 1280 ? 14 : 18);

    // Initialize leaves if empty
    if (leavesRef.current.length === 0) {
      leavesRef.current = createTeaLeaves(leafCount, width, height);
    }

    let isVisible = !document.hidden;
    let isOutOfView = window.scrollY > window.innerHeight * 0.95;

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible && !isOutOfView && !animFrameIdRef.current) {
        lastTime = performance.now();
        animFrameIdRef.current = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Scroll optimization: Pause animation when user scrolls past Hero section (> 95vh)
    const handleScroll = () => {
      const out = window.scrollY > window.innerHeight * 0.95;
      if (out !== isOutOfView) {
        isOutOfView = out;
        if (!isOutOfView && isVisible && !animFrameIdRef.current) {
          lastTime = performance.now();
          animFrameIdRef.current = requestAnimationFrame(render);
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Throttled mouse wind
    const handleMouseMove = (e) => {
      const now = performance.now();
      if (now - (lastMousePosRef.current.time || 0) < 30) return;
      const dt = Math.max(16, now - (lastMousePosRef.current.time || now));
      const dx = e.clientX - (lastMousePosRef.current.x || e.clientX);
      const vx = (dx / dt) * 16;
      targetWindRef.current += Math.max(-1.2, Math.min(1.2, vx * 0.06));
      lastMousePosRef.current = { x: e.clientX, y: e.clientY, time: now };
    };

    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let lastTime = performance.now();

    const render = (time) => {
      if (!isVisible || isOutOfView) {
        animFrameIdRef.current = null;
        return;
      }

      const delta = Math.min((time - lastTime) / 16.667, 2.0);
      lastTime = time;

      // Wind decay & smoothing
      targetWindRef.current *= 0.95;
      mouseWindRef.current += (targetWindRef.current - mouseWindRef.current) * 0.05;
      const currentWind = mouseWindRef.current;

      ctx.clearRect(0, 0, width, height);

      const leaves = leavesRef.current;
      const len = leaves.length;
      const sprites = spritesRef.current;

      for (let i = 0; i < len; i++) {
        const leaf = leaves[i];

        // Sway progress
        leaf.swayPhase += leaf.swaySpeed * delta;
        const swayForce = Math.sin(leaf.swayPhase) * leaf.swayAmplitude;

        // Position updates
        leaf.x += (swayForce + currentWind) * delta;
        leaf.y += leaf.speedY * delta;

        // 3D rotations
        leaf.angleZ += (leaf.spinZSpeed + swayForce * 0.003) * delta;
        leaf.flipX += leaf.flipXSpeed * delta;
        leaf.flipY = (leaf.flipY || 0) + leaf.flipYSpeed * delta;

        // Boundary Wrap - Screen Bottom
        if (leaf.y > height + 50) {
          leaf.y = -50 - Math.random() * 60;
          leaf.x = Math.random() * width;
          leaf.swayPhase = Math.random() * Math.PI * 2;
        }

        // Boundary Wrap - Screen Left / Right
        if (leaf.x > width + 60) {
          leaf.x = -60;
        } else if (leaf.x < -60) {
          leaf.x = width + 60;
        }

        // Fast sprite draw
        const cosFlip = Math.cos(leaf.flipX);
        const isTopSide = cosFlip >= 0;
        const spriteKey = leaf.variant + '-' + (leaf.paletteIdx % LEAF_PALETTES.length) + '-' + isDark + '-' + (isTopSide ? 'top' : 'bottom');
        const sprite = sprites.get(spriteKey);

        if (sprite) {
          ctx.save();
          ctx.translate(leaf.x, leaf.y);
          ctx.rotate(leaf.angleZ);
          ctx.scale(cosFlip, 1 + Math.sin(leaf.flipY || 0) * 0.15);
          ctx.globalAlpha = leaf.opacity * Math.max(0.35, Math.abs(cosFlip));

          const drawSize = leaf.size * 1.3;
          ctx.drawImage(sprite, -drawSize * 0.5, -drawSize * 0.5, drawSize, drawSize);
          ctx.restore();
        }
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    if (!isOutOfView && isVisible) {
      animFrameIdRef.current = requestAnimationFrame(render);
    }

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isEnabled, isDark, customCount]);

  return (
    <>
      {/* 2D Canvas Layer - 100% non-blocking pointer-events-none */}
      <canvas
        ref={canvasRef}
        className={'fixed inset-0 pointer-events-none z-20 transition-opacity duration-700 ' + (isEnabled ? 'opacity-100' : 'opacity-0 pointer-events-none') + ' ' + className}
        aria-hidden="true"
      />

      {/* Floating Controls Toggle */}
      {showToggle && (
        <div className="fixed bottom-6 left-6 z-40">
          <button
            onClick={toggleEffect}
            type="button"
            className={'flex items-center gap-2 px-3 py-2 rounded-full border shadow-tea-sm backdrop-blur-md text-xs font-semibold transition-all duration-300 group hover:scale-105 active:scale-95 ' + (isEnabled ? 'bg-white/90 dark:bg-[#132018]/90 text-tea-primary dark:text-tea-mint border-tea-leaf/30 dark:border-tea-mint/30 hover:shadow-tea-md' : 'bg-white/70 dark:bg-[#132018]/70 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-white/10 opacity-70 hover:opacity-100')}
            title={
              isEnabled
                ? isChinese
                  ? '點擊暫停落葉效果'
                  : 'Bấm để tắt hiệu ứng lá trà rơi'
                : isChinese
                ? '點擊開啟落葉效果'
                : 'Bấm để bật hiệu ứng lá trà rơi'
            }
            aria-label="Toggle falling tea leaves animation"
          >
            <div
              className={'w-5 h-5 rounded-full flex items-center justify-center transition-transform ' + (isEnabled ? 'bg-tea-soft dark:bg-[#1C2F23] text-tea-leaf dark:text-tea-mint group-hover:rotate-12' : 'bg-gray-100 dark:bg-white/5 text-gray-400')}
            >
              <Leaf className="w-3 h-3" />
            </div>
            <span className="hidden sm:inline text-[11px]">
              {isEnabled
                ? isChinese
                  ? '飄逸茶葉'
                  : 'Lá trà rơi'
                : isChinese
                ? '開啟特效'
                : 'Bật hiệu ứng'}
            </span>
          </button>
        </div>
      )}
    </>
  );
}

export default memo(FallingTeaLeaves);
