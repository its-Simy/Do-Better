import React from 'react';

/**
 * Do Better — HabitRow
 * A habit tracker line: name + a strip of day cells you can tap to mark complete,
 * plus a streak count. The cells express consistency at a glance.
 */
export function HabitRow({
  name,
  days = [],           // array of booleans (most recent last) or {done, label}
  streak = 0,
  accent = 'var(--brand)',
  onToggleDay,
  style = {},
}) {
  const cells = days.map((d) => (typeof d === 'object' ? d : { done: d }));

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
      padding: 'var(--space-3) var(--space-4)', background: 'var(--surface)',
      border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-xs)', ...style,
    }}>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 'var(--fs-body-md)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</span>
        <span className="db-num" style={{ fontSize: 'var(--fs-caption)', fontWeight: 'var(--fw-bold)', color: streak > 0 ? 'var(--accent)' : 'var(--text-tertiary)' }}>
          {streak > 0 ? `🔥 ${streak} day streak` : 'Start today'}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-2)', flex: '0 0 auto' }}>
        {cells.map((c, i) => (
          <button
            key={i}
            onClick={() => onToggleDay && onToggleDay(i)}
            aria-label={c.label || `Day ${i + 1}`}
            className="db-hoverable"
            style={{
              width: 28, height: 28, borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              border: c.done ? `1.5px solid ${accent}` : '1.5px solid var(--border-strong)',
              background: c.done ? accent : 'var(--surface)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background-color var(--dur-fast) var(--ease-out), border-color var(--dur-fast)',
            }}
          >
            {c.done && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12.5 L10 17.5 L19 7" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
