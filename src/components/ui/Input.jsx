import React from 'react';

/**
 * Do Better — Input
 * Text field with optional label, leading icon, and helper/error text.
 */
export function Input({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  iconLeft = null,
  helper,
  error,
  disabled = false,
  size = 'md',
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const heights = { sm: 'var(--control-sm)', md: 'var(--control-md)', lg: 'var(--control-lg)' };
  const h = heights[size] || heights.md;
  const borderColor = error ? 'var(--danger)' : focus ? 'var(--brand)' : 'var(--border-strong)';

  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', ...style }}>
      {label && (
        <span style={{ fontSize: 'var(--fs-label)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)' }}>{label}</span>
      )}
      <span style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
        height: h, padding: '0 var(--space-3)',
        background: disabled ? 'var(--surface-inset)' : 'var(--surface)',
        border: `1.5px solid ${borderColor}`,
        borderRadius: 'var(--radius-md)',
        boxShadow: focus ? 'var(--focus-ring)' : 'var(--shadow-xs)',
        transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
      }}>
        {iconLeft && <span style={{ display: 'inline-flex', color: 'var(--text-tertiary)' }}>{iconLeft}</span>}
        <input
          type={type} value={value} placeholder={placeholder} disabled={disabled}
          onChange={onChange} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{
            flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent',
            fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-body-md)', color: 'var(--text-primary)',
          }}
          {...rest}
        />
      </span>
      {(helper || error) && (
        <span style={{ fontSize: 'var(--fs-caption)', color: error ? 'var(--danger)' : 'var(--text-tertiary)' }}>
          {error || helper}
        </span>
      )}
    </label>
  );
}
