import React from 'react';

/**
 * Do Better — Card
 * The fundamental surface container. Rounded, soft-shadowed, optionally
 * interactive (lifts on hover via the shared highlight).
 */
export function Card({
  children,
  padding = 'md',
  interactive = false,
  accent = null,
  className = '',
  style = {},
  ...rest
}) {
  const pads = { none: 0, sm: 'var(--space-4)', md: 'var(--space-5)', lg: 'var(--space-6)' };
  const classes = [interactive ? 'db-hoverable' : '', className].filter(Boolean).join(' ');

  return (
    <div
      className={classes || undefined}
      style={{
        background: 'var(--surface)',
        border: '1.5px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-sm)',
        padding: pads[padding] ?? pads.md,
        cursor: interactive ? 'pointer' : 'default',
        borderTop: accent ? `3px solid ${accent}` : undefined,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
