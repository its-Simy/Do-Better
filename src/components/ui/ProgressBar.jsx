import React from 'react';

/**
 * Do Better — ProgressBar
 * Linear progress for "quantify the goal / when is it good enough" meters.
 * Optional target marker shows the "good enough" threshold.
 */
export function ProgressBar({
  value = 0,
  color = 'var(--brand)',
  height = 10,
  target = null,
  label,
  showValue = false,
  style = {},
}) {
  const pct = Math.max(0, Math.min(100, value));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', ...style }}>
      {(label || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          {label && <span style={{ fontSize: 'var(--fs-body-sm)', fontWeight: 'var(--fw-medium)', color: 'var(--text-secondary)' }}>{label}</span>}
          {showValue && <span className="db-num" style={{ fontSize: 'var(--fs-body-sm)', fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)' }}>{Math.round(pct)}%</span>}
        </div>
      )}
      <div style={{ position: 'relative', height, background: 'var(--surface-inset)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, width: `${pct}%`, background: color,
          borderRadius: 'var(--radius-pill)',
          transition: 'width var(--dur-slow) var(--ease-out)',
        }} />
        {target != null && (
          <div style={{
            position: 'absolute', top: -2, bottom: -2, left: `${Math.min(100, Math.max(0, target))}%`,
            width: 2.5, background: 'var(--text-primary)', borderRadius: 2, opacity: 0.55,
          }} title={`Good enough: ${target}%`} />
        )}
      </div>
    </div>
  );
}
