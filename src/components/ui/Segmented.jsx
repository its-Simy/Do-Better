import React from 'react';

/**
 * Do Better — Segmented control
 * Pill-track selector for 2–4 mutually-exclusive views (Day/Week/Month, etc.).
 */
export function Segmented({ options = [], value, onChange, size = 'md', style = {} }) {
  const items = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const heights = { sm: 'var(--control-sm)', md: 'var(--control-md)' };
  const fs = { sm: 'var(--fs-label)', md: 'var(--fs-body-sm)' };

  return (
    <div role="tablist" style={{
      display: 'inline-flex', alignItems: 'center', gap: 2, padding: 3,
      height: heights[size] || heights.md,
      background: 'var(--surface-inset)', border: '1.5px solid var(--border-subtle)',
      borderRadius: 'var(--radius-pill)', ...style,
    }}>
      {items.map((it) => {
        const active = it.value === value;
        return (
          <button
            key={it.value} role="tab" aria-selected={active}
            onClick={() => onChange && onChange(it.value)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
              height: '100%', padding: '0 var(--space-4)', border: 'none', cursor: 'pointer',
              borderRadius: 'var(--radius-pill)',
              background: active ? 'var(--surface)' : 'transparent',
              color: active ? 'var(--text-primary)' : 'var(--text-tertiary)',
              fontFamily: 'var(--font-sans)', fontSize: fs[size] || fs.md,
              fontWeight: active ? 'var(--fw-semibold)' : 'var(--fw-medium)',
              boxShadow: active ? 'var(--shadow-sm)' : 'none',
              transition: 'background-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
            }}
          >
            {it.icon}{it.label}
          </button>
        );
      })}
    </div>
  );
}
