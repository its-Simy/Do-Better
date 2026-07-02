import React from 'react';

/**
 * Do Better — StatTile
 * Compact metric block for the data tracker (sleep avg, streak, completion…).
 * Shows a value, label, optional trend delta, and optional icon.
 */
export function StatTile({
  value,
  unit,
  label,
  icon = null,
  tone = 'neutral',
  trend = null,        // { dir: 'up'|'down'|'flat', text: '+12%' }
  trendGood = 'up',    // which direction counts as positive (green)
  style = {},
}) {
  const tones = {
    neutral: 'var(--text-primary)',
    brand: 'var(--brand)',
    accent: 'var(--accent)',
    goal: 'var(--goal)',
    sleep: 'var(--sleep)',
  };
  const valueColor = tones[tone] || tones.neutral;

  let trendColor = 'var(--text-tertiary)';
  if (trend && trend.dir !== 'flat') {
    trendColor = trend.dir === trendGood ? 'var(--success)' : 'var(--danger)';
  }
  const arrow = trend ? (trend.dir === 'up' ? '↑' : trend.dir === 'down' ? '↓' : '→') : '';

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 'var(--space-2)',
      padding: 'var(--space-4)', background: 'var(--surface)',
      border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-xs)', ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 'var(--fs-label)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-tertiary)' }}>{label}</span>
        {icon && <span style={{ display: 'inline-flex', color: valueColor, opacity: 0.8 }}>{icon}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span className="db-num" style={{ fontSize: 'var(--fs-title-lg)', fontWeight: 'var(--fw-bold)', color: valueColor, lineHeight: 1 }}>{value}</span>
        {unit && <span className="db-num" style={{ fontSize: 'var(--fs-body-md)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-tertiary)' }}>{unit}</span>}
      </div>
      {trend && (
        <span className="db-num" style={{ fontSize: 'var(--fs-caption)', fontWeight: 'var(--fw-bold)', color: trendColor }}>
          {arrow} {trend.text}
        </span>
      )}
    </div>
  );
}
