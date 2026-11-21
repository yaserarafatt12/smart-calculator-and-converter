'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';

export interface LiquidGlassOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  id?: string;
  ariaLabel?: string;
}

interface LiquidGlassSegmentedProps<T extends string> {
  options: LiquidGlassOption<T>[];
  value: T;
  onChange: (value: T) => void;
  theme?: 'light' | 'dark';
  size?: 'sm' | 'md';
  className?: string;
  ariaLabel?: string;
}

/**
 * True iOS 26 Liquid Glass Hold-and-Scrub Refractive Lens Segmented Control.
 * Modeled directly on Quest's NavigasiBawah.tsx:
 * - overflow-visible outer container so the refractive lens blooms cleanly above/below the pill
 * - clipped frosted glass base shell
 * - pointer capture hold-and-scrub with continuous RAF spring physics & velocity stretch
 * - optical blooming lens with saturate(220%) brightness(1.18), top specular arc, and prismatic bottom refraction
 */
export function LiquidGlassSegmented<T extends string>({
  options,
  value,
  onChange,
  theme,
  size = 'md',
  className = '',
  ariaLabel,
}: LiquidGlassSegmentedProps<T>) {
  const trackRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);

  const [trackSize, setTrackSize] = useState({ width: 0, height: size === 'sm' ? 36 : 44 });
  const [isHolding, setIsHolding] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [detectedDark, setDetectedDark] = useState(true);

  const activePointerIdRef = useRef<number | null>(null);
  const lastHapticIndexRef = useRef<number>(-1);
  const prevClientXRef = useRef<number>(0);

  // Spring simulation state (runs via RAF for 60/120fps liquid glide without React re-renders)
  const springRef = useRef({
    x: 0,
    vx: 0,
    targetX: 0,
    scaleX: 1,
    vScaleX: 0,
    targetScaleX: 1,
    initialized: false,
    rafId: 0 as number | null,
    lastTime: 0,
  });

  // Detect theme from <html> class when theme prop is not explicitly passed
  useEffect(() => {
    if (theme) {
      setDetectedDark(theme === 'dark');
      return;
    }
    if (typeof document === 'undefined') return;
    const sync = () => setDetectedDark(document.documentElement.classList.contains('dark'));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [theme]);

  const isLight = theme ? theme === 'light' : !detectedDark;
  const itemCount = options.length;
  const activeIndex = Math.max(
    0,
    options.findIndex((opt) => opt.value === value)
  );
  const slotWidth = trackSize.width > 0 ? trackSize.width / itemCount : 0;

  // Measure track dimensions responsively
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => {
      setTrackSize({
        width: el.clientWidth,
        height: el.clientHeight || (size === 'sm' ? 36 : 44),
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [size]);

  const restingWidth = Math.max(36, slotWidth - 6);
  const holdingWidth = Math.max(52, slotWidth + 14);
  const restingHeight = Math.max(28, trackSize.height - 8);
  const holdingHeight = trackSize.height + 10;

  const bubbleWidthRef = useRef(restingWidth);
  bubbleWidthRef.current = isHolding ? holdingWidth : restingWidth;

  // Apply lens DOM transform directly
  const applyLensTransform = useCallback((cx: number, sx: number) => {
    const el = lensRef.current;
    if (!el) return;
    const bw = bubbleWidthRef.current;
    el.style.left = `${cx - bw / 2}px`;
    el.style.transform = `translate3d(0, -50%, 0) scaleX(${sx.toFixed(4)})`;
  }, []);

  // Kick off / continue RAF spring loop
  const startSpring = useCallback(() => {
    const s = springRef.current;
    if (s.rafId) return;
    s.lastTime = performance.now();

    const step = (now: number) => {
      const dt = Math.min(0.032, Math.max(0.001, (now - s.lastTime) / 1000));
      s.lastTime = now;

      // Center X spring (Quest constants: stiffness 420, damping 32, mass 0.72)
      const kX = 420;
      const cX = 32;
      const mX = 0.72;
      const ax = (-kX * (s.x - s.targetX) - cX * s.vx) / mX;
      s.vx += ax * dt;
      s.x += s.vx * dt;

      // Elastic stretch spring (Quest constants: stiffness 360, damping 26)
      const kS = 360;
      const cS = 26;
      const aS = -kS * (s.scaleX - s.targetScaleX) - cS * s.vScaleX;
      s.vScaleX += aS * dt;
      s.scaleX += s.vScaleX * dt;

      // Decay target stretch smoothly back to 1
      s.targetScaleX += (1 - s.targetScaleX) * Math.min(1, dt * 16);

      applyLensTransform(s.x, s.scaleX);

      const settledX = Math.abs(s.x - s.targetX) < 0.08 && Math.abs(s.vx) < 0.1;
      const settledS = Math.abs(s.scaleX - 1) < 0.001 && Math.abs(s.vScaleX) < 0.005;

      if (settledX && settledS) {
        s.x = s.targetX;
        s.vx = 0;
        s.scaleX = 1;
        s.vScaleX = 0;
        applyLensTransform(s.x, 1);
        s.rafId = null;
        return;
      }

      s.rafId = requestAnimationFrame(step);
    };

    s.rafId = requestAnimationFrame(step);
  }, [applyLensTransform]);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (springRef.current.rafId) {
        cancelAnimationFrame(springRef.current.rafId);
        springRef.current.rafId = null;
      }
    };
  }, []);

  // Snap lens to active segment when not dragging
  useEffect(() => {
    if (!isHolding && slotWidth > 0) {
      const targetCenter = activeIndex * slotWidth + slotWidth / 2;
      const s = springRef.current;
      s.targetX = targetCenter;
      if (!s.initialized) {
        s.x = targetCenter;
        s.initialized = true;
        applyLensTransform(s.x, 1);
      } else {
        startSpring();
      }
    }
  }, [activeIndex, slotWidth, isHolding, applyLensTransform, startSpring]);

  // Re-center immediately when isHolding changes bubble width
  useEffect(() => {
    if (slotWidth > 0 && springRef.current.initialized) {
      applyLensTransform(springRef.current.x, springRef.current.scaleX);
    }
  }, [isHolding, restingWidth, holdingWidth, slotWidth, applyLensTransform]);

  const commitByIndex = useCallback(
    (idx: number) => {
      const opt = options[idx];
      if (!opt) return;
      if (opt.value !== value) {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(10);
        }
        onChange(opt.value);
      }
    },
    [options, value, onChange]
  );

  const getIndexFromClientX = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el || slotWidth <= 0) return { idx: activeIndex, clampedX: 0 };
      const rect = el.getBoundingClientRect();
      const relX = clientX - rect.left;
      const minCenter = slotWidth / 2;
      const maxCenter = rect.width - slotWidth / 2;
      const clampedX = Math.max(minCenter, Math.min(maxCenter, relX));
      const idx = Math.max(0, Math.min(itemCount - 1, Math.floor(relX / slotWidth)));
      return { idx, clampedX };
    },
    [activeIndex, itemCount, slotWidth]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    activePointerIdRef.current = e.pointerId;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore if unsupported
    }

    const { idx, clampedX } = getIndexFromClientX(e.clientX);
    setIsHolding(true);
    setHoverIndex(idx);
    lastHapticIndexRef.current = idx;
    prevClientXRef.current = clampedX;

    const s = springRef.current;
    s.targetX = clampedX;
    startSpring();

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(8);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isHolding || activePointerIdRef.current !== e.pointerId) return;
    const { idx, clampedX } = getIndexFromClientX(e.clientX);

    const velocity = Math.abs(clampedX - prevClientXRef.current);
    prevClientXRef.current = clampedX;

    const s = springRef.current;
    s.targetX = clampedX;
    s.targetScaleX = 1 + Math.min(0.14, velocity * 0.006);
    startSpring();

    if (idx !== lastHapticIndexRef.current) {
      lastHapticIndexRef.current = idx;
      setHoverIndex(idx);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(6);
      }
    }
  };

  const finishInteraction = (e: React.PointerEvent<HTMLDivElement>, shouldCommit: boolean) => {
    if (activePointerIdRef.current !== e.pointerId) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore if already released
    }
    activePointerIdRef.current = null;

    const finalIdx = hoverIndex ?? activeIndex;
    setIsHolding(false);
    setHoverIndex(null);

    if (shouldCommit) {
      commitByIndex(finalIdx);
    }

    if (slotWidth > 0) {
      const snapCenter = (shouldCommit ? finalIdx : activeIndex) * slotWidth + slotWidth / 2;
      const s = springRef.current;
      s.targetX = snapCenter;
      s.targetScaleX = 1;
      prevClientXRef.current = snapCenter;
      startSpring();
    }
  };

  const displayActiveIndex = isHolding && hoverIndex !== null ? hoverIndex : activeIndex;
  const heightClass = size === 'sm' ? 'h-9' : 'h-[44px]';

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`relative ${heightClass} rounded-full overflow-visible transition-transform duration-300 ${
        isHolding ? 'scale-[1.015]' : 'scale-100'
      } ${className}`}
    >
      {/* Clipped Frosted Glass Base Shell */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 rounded-full overflow-hidden border pointer-events-none ${
          isLight
            ? 'border-[#00A3FF]/25 shadow-[0_8px_24px_rgba(10,17,40,0.08)]'
            : 'border-white/[0.18] shadow-[0_12px_36px_rgba(0,0,0,0.40)]'
        }`}
      >
        <div
          className="absolute inset-0 z-0 rounded-full"
          style={{
            backdropFilter: 'blur(24px) saturate(110%)',
            WebkitBackdropFilter: 'blur(24px) saturate(110%)',
          }}
        />
        <div
          className="absolute inset-0 z-10 rounded-full"
          style={{
            background: isLight
              ? 'rgba(255, 255, 255, 0.72)'
              : 'linear-gradient(180deg, rgba(255, 255, 255, 0.09) 0%, rgba(28, 32, 40, 0.52) 100%)',
          }}
        />
        <div
          className="absolute inset-0 z-20 rounded-full"
          style={{
            boxShadow: isLight
              ? 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.82)'
              : 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.20), inset 0 -1px 1px 0 rgba(255, 255, 255, 0.04)',
          }}
        />
      </div>

      {/* Interactive Scrub Track */}
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(e) => finishInteraction(e, true)}
        onPointerCancel={(e) => finishInteraction(e, false)}
        className="relative z-30 flex items-center h-full w-full touch-none select-none cursor-grab active:cursor-grabbing"
      >
        {/* iOS 26 Liquid Glass Blooming Refractive Lens Bubble */}
        {slotWidth > 0 && (
          <div
            ref={lensRef}
            aria-hidden="true"
            className="absolute top-1/2 rounded-full pointer-events-none z-10 overflow-hidden will-change-transform"
            style={{
              width: isHolding ? holdingWidth : restingWidth,
              height: isHolding ? holdingHeight : restingHeight,
              transition:
                'width 260ms cubic-bezier(0.34, 1.38, 0.64, 1), height 260ms cubic-bezier(0.34, 1.38, 0.64, 1)',
            }}
          >
            {/* Main Refractive Glass Body */}
            <div
              className="w-full h-full rounded-full relative transition-all duration-200"
              style={{
                backdropFilter: isHolding
                  ? 'blur(12px) saturate(160%) brightness(1.14)'
                  : 'blur(12px) saturate(110%)',
                WebkitBackdropFilter: isHolding
                  ? 'blur(12px) saturate(160%) brightness(1.14)'
                  : 'blur(12px) saturate(110%)',
                background: isHolding
                  ? isLight
                    ? 'radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,0.78) 0%, rgba(240,244,250,0.45) 60%, rgba(200,210,225,0.28) 100%)'
                    : 'radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,0.28) 0%, rgba(210,218,230,0.16) 55%, rgba(255,255,255,0.10) 100%)'
                  : isLight
                    ? 'rgba(10, 17, 40, 0.08)'
                    : 'rgba(255, 255, 255, 0.16)',
                boxShadow: isHolding
                  ? isLight
                    ? 'inset 0 2px 3px rgba(255,255,255,0.95), inset 0 -2px 4px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.14), 0 0 0 1px rgba(255,255,255,0.8)'
                    : 'inset 0 2px 3px rgba(255,255,255,0.72), inset 0 -2px 5px rgba(255,255,255,0.22), inset 2px 0 4px rgba(255,255,255,0.24), inset -2px 0 4px rgba(200,210,230,0.20), 0 10px 28px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.36)'
                  : isLight
                    ? 'inset 0 1px 1px rgba(255,255,255,0.7)'
                    : 'inset 0 1px 1px rgba(255,255,255,0.22)',
              }}
            >
              {/* Full-bleed Top Specular Sheen (only when holding — no inner oval sticker) */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none transition-opacity duration-200"
                style={{
                  opacity: isHolding ? 0.9 : 0,
                  background:
                    'radial-gradient(100% 70% at 50% 0%, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.06) 55%, transparent 100%)',
                }}
              />
              {/* Bottom Prismatic Chromatic Refraction Rim */}
              <div
                className="absolute bottom-[1px] left-[12%] right-[12%] h-[4px] rounded-full blur-[1.5px] pointer-events-none transition-opacity duration-200"
                style={{
                  opacity: isHolding ? 0.75 : 0,
                  background:
                    'linear-gradient(90deg, rgba(200,220,255,0.75) 0%, rgba(255,255,255,0.9) 50%, rgba(215,205,255,0.75) 100%)',
                }}
              />
            </div>
          </div>
        )}

        {/* Segment Buttons */}
        {options.map((opt, idx) => {
          const isActive = displayActiveIndex === idx;
          const isBeingHeld = isHolding && hoverIndex === idx;
          return (
            <button
              key={opt.value}
              id={opt.id}
              type="button"
              role="tab"
              aria-selected={value === opt.value}
              aria-label={opt.ariaLabel || opt.label}
              onClick={() => commitByIndex(idx)}
              className="relative z-20 flex-1 h-full flex items-center justify-center gap-1.5 px-3 rounded-full cursor-pointer select-none focus:outline-none"
            >
              <span
                className={`inline-flex items-center justify-center gap-1.5 font-semibold tracking-tight whitespace-nowrap transition-all duration-200 ${
                  size === 'sm' ? 'text-xs' : 'text-[13px]'
                } ${
                  isBeingHeld
                    ? 'scale-[1.08] -translate-y-[0.5px]'
                    : isActive
                      ? 'scale-[1.02]'
                      : 'scale-100'
                } ${
                  isActive
                    ? isLight
                      ? 'text-[#0A1128]'
                      : 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.35)]'
                    : isLight
                      ? 'text-[#0A1128]/55 hover:text-[#0A1128]/80'
                      : 'text-white/55 hover:text-white/85'
                }`}
              >
                {opt.icon && (
                  <span className="shrink-0 transition-colors duration-200">
                    {opt.icon}
                  </span>
                )}
                <span>{opt.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default LiquidGlassSegmented;
