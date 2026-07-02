import React from 'react';

export const HOLD_TO_FILL_DEFAULTS = {
  speed: 80,
  completeFlashMs: 500,
  fillStyleProperty: '--hold-pct',
};

function clampPct(value) {
  return Math.min(100, Math.max(0, value));
}

function isHoldKey(event) {
  return event.key === ' ' || event.key === 'Enter';
}

export function useHoldToFill({
  speed = HOLD_TO_FILL_DEFAULTS.speed,
  completeFlashMs = HOLD_TO_FILL_DEFAULTS.completeFlashMs,
  fillStyleProperty = HOLD_TO_FILL_DEFAULTS.fillStyleProperty,
  onComplete,
  onReset,
} = {}) {
  const targetRef = React.useRef(null);
  const pctRef = React.useRef(0);
  const holdingRef = React.useRef(false);
  const doneRef = React.useRef(false);
  const frameRef = React.useRef(0);
  const lastFrameRef = React.useRef(null);
  const flashTimerRef = React.useRef(0);
  const speedRef = React.useRef(speed);
  const completeFlashMsRef = React.useRef(completeFlashMs);
  const onCompleteRef = React.useRef(onComplete);
  const onResetRef = React.useRef(onReset);
  const [done, setDone] = React.useState(false);
  const [completeFlash, setCompleteFlash] = React.useState(false);

  React.useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  React.useEffect(() => {
    completeFlashMsRef.current = completeFlashMs;
  }, [completeFlashMs]);

  React.useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  React.useEffect(() => {
    onResetRef.current = onReset;
  }, [onReset]);

  const writePct = React.useCallback((nextPct) => {
    const pct = clampPct(nextPct);
    pctRef.current = pct;

    if (targetRef.current) {
      targetRef.current.style.setProperty(fillStyleProperty, `${pct}%`);
    }
  }, [fillStyleProperty]);

  const complete = React.useCallback(() => {
    if (doneRef.current) return;

    holdingRef.current = false;
    doneRef.current = true;
    writePct(100);
    setDone(true);
    setCompleteFlash(true);
    onCompleteRef.current?.();

    window.clearTimeout(flashTimerRef.current);
    const flashMs = completeFlashMsRef.current;

    if (flashMs > 0) {
      flashTimerRef.current = window.setTimeout(() => {
        setCompleteFlash(false);
        flashTimerRef.current = 0;
      }, flashMs);
    } else {
      setCompleteFlash(false);
    }
  }, [writePct]);

  const reset = React.useCallback(() => {
    holdingRef.current = false;
    doneRef.current = false;
    window.clearTimeout(flashTimerRef.current);
    flashTimerRef.current = 0;
    writePct(0);
    setDone(false);
    setCompleteFlash(false);
    onResetRef.current?.();
  }, [writePct]);

  const handlePressStart = React.useCallback((event) => {
    if (event.button != null && event.button !== 0) return;

    if (doneRef.current) {
      reset();
      return;
    }

    holdingRef.current = true;
  }, [reset]);

  const handleKeyDown = React.useCallback((event) => {
    if (!isHoldKey(event)) return;

    event.preventDefault();
    if (event.repeat) return;

    if (doneRef.current) {
      reset();
      return;
    }

    holdingRef.current = true;
  }, [reset]);

  const releaseHolding = React.useCallback(() => {
    holdingRef.current = false;
  }, []);

  const handleKeyRelease = React.useCallback((event) => {
    if (!isHoldKey(event)) return;
    releaseHolding();
  }, [releaseHolding]);

  React.useEffect(() => {
    function tick(now) {
      if (lastFrameRef.current == null) {
        lastFrameRef.current = now;
      }

      const dt = (now - lastFrameRef.current) / 1000;
      lastFrameRef.current = now;

      if (!doneRef.current) {
        const direction = holdingRef.current ? 1 : -1;
        const currentPct = pctRef.current;
        const nextPct = clampPct(currentPct + direction * speedRef.current * dt);

        if (nextPct !== currentPct) {
          writePct(nextPct);
        }

        if (holdingRef.current && nextPct >= 100) {
          complete();
        }
      } else if (pctRef.current !== 100) {
        writePct(100);
      }

      frameRef.current = requestAnimationFrame(tick);
    }

    writePct(pctRef.current);
    window.addEventListener('pointerup', releaseHolding);
    window.addEventListener('pointercancel', releaseHolding);
    window.addEventListener('keyup', handleKeyRelease);
    window.addEventListener('blur', releaseHolding);
    frameRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.clearTimeout(flashTimerRef.current);
      window.removeEventListener('pointerup', releaseHolding);
      window.removeEventListener('pointercancel', releaseHolding);
      window.removeEventListener('keyup', handleKeyRelease);
      window.removeEventListener('blur', releaseHolding);
    };
  }, [complete, handleKeyRelease, releaseHolding, writePct]);

  const holdProps = React.useMemo(() => ({
    onPointerDown: handlePressStart,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyRelease,
  }), [handleKeyDown, handleKeyRelease, handlePressStart]);

  return {
    targetRef,
    fillRef: targetRef,
    pctRef,
    holdingRef,
    doneRef,
    done,
    completeFlash,
    holdProps,
    reset,
    complete,
    setPct: writePct,
  };
}
