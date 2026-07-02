import React from 'react';

/**
 * Do Better — Select
 * Native dropdown styled to match the shared form controls.
 */
export function Select({
  label,
  value,
  onChange,
  options = [],
  disabled = false,
  size = 'md',
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const heights = { sm: 'var(--control-sm)', md: 'var(--control-md)', lg: 'var(--control-lg)' };
  const h = heights[size] || heights.md;
  const borderColor = focus ? 'var(--brand)' : 'var(--border-strong)';

  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', ...style }}>
      {label && (
        <span style={{ fontSize: 'var(--fs-label)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)' }}>{label}</span>
      )}
      <span style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        height: h,
        background: disabled ? 'var(--surface-inset)' : 'var(--surface)',
        border: `1.5px solid ${borderColor}`,
        borderRadius: 'var(--radius-md)',
        boxShadow: focus ? 'var(--focus-ring)' : 'var(--shadow-xs)',
        transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
      }}>
        <select
          value={value}
          disabled={disabled}
          onChange={(event) => onChange && onChange(event.target.value, event)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            width: '100%',
            height: '100%',
            appearance: 'none',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            padding: '0 38px 0 var(--space-3)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--fs-body-md)',
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
          {...rest}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: 'var(--space-3)',
            color: 'var(--text-tertiary)',
            pointerEvents: 'none',
            fontSize: 12,
          }}
        >
          ▾
        </span>
      </span>
    </label>
  );
}
