import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  // 2. Spring First Flush (Tươi mát, xanh non mơn mởn)
  {
    light: { tip: '#86efac', body: '#22c55e', base: '#15803d' },
    dark: { tip: '#a7f3d0', body: '#10b981', base: '#065f46' },
  },
  // 3. Golden Roasted Oolong (Ấm áp, đượm hương mật hoa)
  {
    light: { tip: '#bef264', body: '#65a30d', base: '#3f6212' },
    dark: { tip: '#d9f99d', body: '#84cc16', base: '#365314' },
  },
];

/**
 * Draw a single high-detail botanical tea leaf onto Canvas 2D
 */
function drawTeaLeaf(ctx, leaf, isDark) {
  ctx.save();
  ctx.translate(leaf.x, leaf.y);
  ctx.rotate(leaf.angleZ);

  // 3D Perspective tumbling (spinning along X and Y axes)
  const cosFlip = Math.cos(leaf.flipX);
  const sinFlipY = Math.sin(leaf.flipY || 0);
  ctx.scale(cosFlip, 1 + sinFlipY * 0.15);

  const length = leaf.size;
  const halfLen = length * 0.5;
  const width = length * leaf.aspectRatio;
  const isTopSide = cosFlip >= 0;

  // Depth & angle opacity
  const edgeFactor = Math.max(0.25, Math.abs(cosFlip));
  ctx.globalAlpha = leaf.opacity * (0.75 + 0.25 * edgeFactor);

  // Gradient fill depending on side (glossy upper vs soft matte underside)
  const palette = LEAF_PALETTES[leaf.paletteIdx % LEAF_PALETTES.length];
  const colors = isDark ? palette.dark : palette.light;
  const grad = ctx.createLinearGradient(0, -halfLen, 0, halfLen);

  if (isTopSide) {
    grad.addColorStop(0, colors.tip);
    grad.addColorStop(0.55, colors.body);
    grad.addColorStop(1, colors.base);
  } else {
    // Underside is softer matte green
    grad.addColorStop(0, isDark ? '#a7f3d0' : '#bbf7d0');
    grad.addColorStop(0.6, isDark ? '#34d399' : '#4ade80');
    grad.addColorStop(1, isDark ? '#059669' : '#16a34a');
  }

  // Botanical Leaf Outline
  ctx.beginPath();
  if (leaf.variant === 1) {
    // S-curve wind-blown leaf
    ctx.moveTo(width * 0.2, -halfLen);
    ctx.bezierCurveTo(-width * 1.25, -halfLen * 0.35, -width * 0.85, halfLen * 0.35, 0, halfLen);
    ctx.bezierCurveTo(width * 0.9, halfLen * 0.4, width * 1.3, -halfLen * 0.25, width * 0.2, -halfLen);
  } else if (leaf.variant === 2) {
    // Slender tender bud (Búp tôm non)
    ctx.moveTo(0, -halfLen);
    ctx.bezierCurveTo(-width * 0.9, -halfLen * 0.3, -width * 0.7, halfLen * 0.4, 0, halfLen);
    ctx.bezierCurveTo(width * 0.7, halfLen * 0.4, width * 0.9, -halfLen * 0.3, 0, -halfLen);
  } else {
    // Classic lanceolate tea leaf (Lá trà chuẩn)
    ctx.moveTo(0, -halfLen);
    ctx.bezierCurveTo(-width * 1.15, -halfLen * 0.3, -width * 0.95, halfLen * 0.35, 0, halfLen);
    ctx.bezierCurveTo(width * 0.95, halfLen * 0.35, width * 1.15, -halfLen * 0.3, 0, -halfLen);
  }
  ctx.closePath();

  // Subtle ambient glow / shadow on foreground leaves
  if (leaf.layer === 'front') {
    ctx.shadowColor = isDark ? 'rgba(52, 211, 153, 0.35)' : 'rgba(21, 128, 61, 0.18)';
    ctx.shadowBlur = isDark ? 8 : 5;
    ctx.shadowOffsetY = 2.5;
  } else {
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }

  ctx.fillStyle = grad;
  ctx.fill();

  // Reset shadow for fine vein lines
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  // Central Vein (Gân lá chính)
  ctx.beginPath();
  ctx.moveTo(0, halfLen + length * 0.08); // small petiole
  ctx.quadraticCurveTo(width * 0.06, 0, 0, -halfLen + length * 0.05);
  ctx.strokeStyle = isDark
    ? (isTopSide ? 'rgba(167, 243, 208, 0.5)' : 'rgba(110, 231, 183, 0.35)')
    : (isTopSide ? 'rgba(255, 255, 255, 0.55)' : 'rgba(187, 247, 208, 0.4)');
  ctx.lineWidth = Math.max(0.65, length * 0.035);
  ctx.stroke();

  // Delicate Side Veins (Gân phụ - for mid and front leaves)
  if (leaf.layer !== 'back' && Math.abs(cosFlip) > 0.35) {
    ctx.strokeStyle = isDark ? 'rgba(167, 243, 208, 0.25)' : 'rgba(255, 255, 255, 0.28)';
    ctx.lineWidth = Math.max(0.4, length * 0.02);
    const veinSteps = 3;
    for (let i = 1; i <= veinSteps; i++) {
      const vY = halfLen - i * length * 0.23;
      // Left vein
      ctx.beginPath();
      ctx.moveTo(0, vY);
      ctx.quadraticCurveTo(-width * 0.35, vY - length * 0.08, -width * 0.65, vY - length * 0.12);
      ctx.stroke();
      // Right vein
      ctx.beginPath();
      ctx.moveTo(0, vY);
      ctx.quadraticCurveTo(width * 0.35, vY - length * 0.08, width * 0.65, vY - length * 0.12);
      ctx.stroke();
    }
  }

  ctx.restore();
}

/**
 * Generate randomized tea leaves distributed across the viewport
 */
function createTeaLeaves(count, width, height) {
  const leaves = [];
  for (let i = 0; i < count; i++) {
    // 3 Depth Layers
    const layerRand = Math.random();
    const layer = layerRand < 0.28 ? 'back' : layerRand < 0.82 ? 'mid' : 'front';

    let size, speedY, opacity;
    if (layer === 'back') {
      size = 14 + Math.random() * 8;
      speedY = 0.55 + Math.random() * 0.45;
      opacity = 0.35 + Math.random() * 0.2;
    } else if (layer === 'mid') {
      size = 22 + Math.random() * 10;
      speedY = 0.95 + Math.random() * 0.55;
      opacity = 0.65 + Math.random() * 0.2;
    } else {
      size = 32 + Math.random() * 12;
      speedY = 1.45 + Math.random() * 0.75;
      opacity = 0.85 + Math.random() * 0.15;
    }

    leaves.push({
      id: i,
      layer,
      variant: Math.floor(Math.random() * 3), // 0: standard, 1: curved, 2: bud
      paletteIdx: Math.floor(Math.random() * LEAF_PALETTES.length),
      x: Math.random() * width,
      y: Math.random() * height, // distribute evenly on start
      size,
      aspectRatio: 0.36 + Math.random() * 0.12,
      speedY,
      swayPhase: Math.random() * Math.PI * 2,
      swaySpeed: 0.015 + Math.random() * 0.02,
      swayAmplitude: 0.8 + Math.random() * 1.4,
      angleZ: Math.random() * Math.PI * 2,
      spinZSpeed: (Math.random() - 0.5) * 0.018,
      flipX: Math.random() * Math.PI * 2,
      flipXSpeed: 0.012 + Math.random() * 0.02,
      flipY: Math.random() * Math.PI * 2,
      flipYSpeed: 0.008 + Math.random() * 0.014,
      opacity,
    });
  }
  return leaves;
}

export default function FallingTeaLeaves({
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

  // Listen to theme changes on html element
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

  // Canvas animation loop
  useEffect(() => {
    if (!isEnabled) {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();

    // Determine count: mobile ~14, desktop ~24
    const leafCount =
      customCount || (width < 768 ? 14 : width < 1280 ? 20 : 26);

    // Initialize leaves if empty
    if (leavesRef.current.length === 0) {
      leavesRef.current = createTeaLeaves(leafCount, width, height);
    }

    let isVisible = !document.hidden;
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Mouse drift interaction
    const handleMouseMove = (e) => {
      const now = performance.now();
      const dt = Math.max(16, now - (lastMousePosRef.current.time || now));
      const dx = e.clientX - (lastMousePosRef.current.x || e.clientX);
      const vx = (dx / dt) * 16; // pixels per ~frame

      // Apply subtle wind in direction of cursor motion
      targetWindRef.current += Math.max(-1.5, Math.min(1.5, vx * 0.08));

      lastMousePosRef.current = { x: e.clientX, y: e.clientY, time: now };
    };

    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let lastTime = performance.now();

    const render = (time) => {
      if (!isVisible) {
        animFrameIdRef.current = requestAnimationFrame(render);
        return;
      }

      const delta = Math.min((time - lastTime) / 16.667, 2.5); // normalized frame step
      lastTime = time;

      // Wind decay & smoothing
      targetWindRef.current *= 0.94;
      mouseWindRef.current += (targetWindRef.current - mouseWindRef.current) * 0.06;
      const currentWind = mouseWindRef.current;

      ctx.clearRect(0, 0, width, height);

      const leaves = leavesRef.current;
      const len = leaves.length;

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
        if (leaf.y > height + 60) {
          leaf.y = -60 - Math.random() * 80;
          leaf.x = Math.random() * width;
          leaf.swayPhase = Math.random() * Math.PI * 2;
        }

        // Boundary Wrap - Screen Left / Right
        if (leaf.x > width + 80) {
          leaf.x = -80;
        } else if (leaf.x < -80) {
          leaf.x = width + 80;
        }

        // Draw leaf
        drawTeaLeaf(ctx, leaf, isDark);
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isEnabled, isDark, customCount]);

  return (
    <>
      {/* 2D Canvas Layer - 100% non-blocking pointer-events-none */}
      {isEnabled && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={`fixed inset-0 pointer-events-none z-20 w-full h-full ${className}`}
          style={{ pointerEvents: 'none' }}
        />
      )}

      {/* Floating Toggle Button (Discreet, bottom-left) */}
      {showToggle && (
        <div className="fixed bottom-6 left-6 z-40">
          <button
            onClick={toggleEffect}
            type="button"
            className={`flex items-center gap-2 px-3 py-2 rounded-full border shadow-tea-sm backdrop-blur-md text-xs font-semibold transition-all duration-300 group hover:scale-105 active:scale-95 ${
              isEnabled
                ? 'bg-white/90 dark:bg-[#132018]/90 text-tea-primary dark:text-tea-mint border-tea-leaf/30 dark:border-tea-mint/30 hover:shadow-tea-md'
                : 'bg-white/70 dark:bg-[#132018]/70 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-white/10 opacity-70 hover:opacity-100'
            }`}
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
              className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform ${
                isEnabled
                  ? 'bg-tea-soft dark:bg-[#1C2F23] text-tea-leaf dark:text-tea-mint group-hover:rotate-12'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-400'
              }`}
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

