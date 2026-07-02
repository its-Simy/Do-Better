import React from 'react';

/**
 * Do Better — Switch
 * Toggle for settings & feature flags (dark mode, hover-highlight, notifications…).
 */
export function Switch({
  checked = false,
  onChange,
  label,
  disabled = false,
  size = 'md',
  style = {},
  ...rest
}) {
  const dims = {
    sm: { w: 36, h: 20, knob: 14 },
    md: { w: 46, h: 26, knob: 20 },
  };
  const d = dims[size] || dims.md;
  const pad = (d.h - d.knob) / 2;

  return (
    <label style={{
      display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)',
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, ...style,
    }}>
      <input
        type="checkbox" role="switch" checked={checked} disabled={disabled}
        onChange={(e) => onChange && onChange(e.target.checked, e)}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
        {...rest}
      />
      <span aria-hidden="true" style={{
        width: d.w, height: d.h, flex: '0 0 auto', borderRadius: 'var(--radius-pill)',
        background: checked ? 'var(--brand)' : 'var(--border-strong)',
        boxShadow: 'var(--shadow-inset)',
        transition: 'background-color var(--dur-base) var(--ease-out)',
        position: 'relative',
      }}>
        <span style={{
          position: 'absolute', top: pad, left: checked ? d.w - d.knob - pad : pad,
          width: d.knob, height: d.knob, borderRadius: '50%', background: '#fff',
          boxShadow: 'var(--shadow-sm)',
          transition: 'left var(--dur-base) var(--ease-spring)',
        }} />
      </span>
      {label && <span style={{ fontSize: 'var(--fs-body-md)', fontWeight: 'var(--fw-medium)', color: 'var(--text-primary)' }}>{label}</span>}
    </label>
  );
}
