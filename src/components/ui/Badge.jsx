import React from 'react';

/**
 * Do Better — Badge
 * Small status / category pill. Tonal by default; `solid` for emphasis.
 */
export function Badge({ children, tone = 'neutral', solid = false, dot = false, icon = null, style = {} }) {
  const tones = {
    neutral: { sub: 'var(--surface-inset)', subText: 'var(--text-secondary)', solid: 'var(--neutral-700)' },
    brand:   { sub: 'var(--brand-subtle)', subText: 'var(--brand-active)', solid: 'var(--brand)' },
    accent:  { sub: 'var(--accent-subtle)', subText: 'var(--ember-700)', solid: 'var(--accent)' },
    goal:    { sub: 'var(--goal-subtle)', subText: 'var(--honey-600)', solid: 'var(--goal)' },
    sleep:   { sub: 'var(--sleep-subtle)', subText: 'var(--dusk-700)', solid: 'var(--sleep)' },
    success: { sub: 'var(--success-subtle)', subText: 'var(--sprout-700)', solid: 'var(--success)' },
    warning: { sub: 'var(--warning-subtle)', subText: 'var(--honey-600)', solid: 'var(--warning)' },
    danger:  { sub: 'var(--danger-subtle)', subText: 'var(--danger)', solid: 'var(--danger)' },
  };
  const t = tones[tone] || tones.neutral;

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)',
      padding: '3px var(--space-2)', height: 22,
      background: solid ? t.solid : t.sub,
      color: solid ? '#fff' : t.subText,
      borderRadius: 'var(--radius-pill)',
      fontSize: 'var(--fs-caption)', fontWeight: 'var(--fw-bold)',
      letterSpacing: 'var(--ls-snug)', lineHeight: 1, whiteSpace: 'nowrap', ...style,
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: solid ? '#fff' : t.solid }} />}
      {icon}
      {children}
    </span>
  );
}
