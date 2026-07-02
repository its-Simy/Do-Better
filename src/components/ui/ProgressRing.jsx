import React from 'react';

/**
 * Do Better — ProgressRing
 * Circular progress for goal completion / habit consistency. Optional center label.
 */
export function ProgressRing({
  value = 0,
  size = 72,
  thickness = 8,
  color = 'var(--brand)',
  track = 'var(--surface-inset)',
  label,
  sublabel,
  style = {},
}) {
  const pct = Math.max(0, Math.min(100, value));
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);

  return (
    <div style={{ position: 'relative', width: size, height: size, ...style }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={thickness} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
          strokeWidth={thickness} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset var(--dur-slow) var(--ease-out)' }}
        />
      </svg>
      {(label || sublabel) && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 0,
        }}>
          {label && <span className="db-num" style={{ fontSize: size * 0.26, fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)', lineHeight: 1 }}>{label}</span>}
          {sublabel && <span style={{ fontSize: size * 0.12, color: 'var(--text-tertiary)', fontWeight: 'var(--fw-semibold)' }}>{sublabel}</span>}
        </div>
      )}
    </div>
  );
}
