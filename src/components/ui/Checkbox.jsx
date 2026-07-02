import React from 'react';

/**
 * Do Better — Checkbox
 * The core "check it off" control. Rounded-square, fills brand-green with an
 * animated check on completion. Supports an optional label and indeterminate state.
 */
export function Checkbox({
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  indeterminate = false,
  size = 'md',
  accent = 'var(--brand)',
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const boxes = { sm: 18, md: 22, lg: 26 };
  const box = boxes[size] || 22;
  const on = checked || indeterminate;

  return (
    <label
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: description ? 'flex-start' : 'center',
        gap: 'var(--space-3)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange && onChange(e.target.checked, e)}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
        {...rest}
      />
      <span
        aria-hidden="true"
        style={{
          width: box,
          height: box,
          flex: '0 0 auto',
          borderRadius: Math.round(box * 0.32),
          background: on ? accent : 'var(--surface)',
          border: `2px solid ${on ? accent : (hover ? 'var(--border-strong)' : 'var(--border-strong)')}`,
          boxShadow: hover && !on ? `0 0 0 4px var(--highlight-wash)` : 'var(--shadow-xs)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
          marginTop: description ? 2 : 0,
        }}
      >
        {indeterminate ? (
          <span style={{ width: box * 0.5, height: 2.5, borderRadius: 2, background: '#fff' }} />
        ) : (
          <svg width={box * 0.62} height={box * 0.62} viewBox="0 0 24 24" fill="none"
            style={{ opacity: checked ? 1 : 0, animation: checked ? 'db-check-pop var(--dur-base) var(--ease-spring)' : 'none' }}>
            <path d="M5 12.5 L10 17.5 L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {(label || description) && (
        <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {label && (
            <span style={{
              fontSize: 'var(--fs-body-md)',
              fontWeight: 'var(--fw-medium)',
              color: 'var(--text-primary)',
              textDecoration: checked && !description ? 'line-through' : 'none',
              textDecorationColor: 'var(--text-tertiary)',
            }}>{label}</span>
          )}
          {description && (
            <span style={{ fontSize: 'var(--fs-body-sm)', color: 'var(--text-tertiary)' }}>{description}</span>
          )}
        </span>
      )}
    </label>
  );
}
