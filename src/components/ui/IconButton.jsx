import React from 'react';

/**
 * Do Better — IconButton
 * Compact square control for a single icon (toolbar, list-row actions, close, etc.).
 */
export function IconButton({
  children,
  label,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);

  const sizes = {
    sm: { box: '32px', radius: 'var(--radius-sm)' },
    md: { box: '40px', radius: 'var(--radius-md)' },
    lg: { box: '48px', radius: 'var(--radius-lg)' },
  };

  const palettes = {
    ghost: { bg: hover ? 'var(--surface-hover)' : 'transparent', color: 'var(--text-secondary)', border: 'transparent' },
    soft: { bg: hover ? 'var(--brand-subtle-hover)' : 'var(--brand-subtle)', color: 'var(--brand-active)', border: 'transparent' },
    outline: { bg: hover ? 'var(--surface-hover)' : 'var(--surface)', color: 'var(--text-primary)', border: 'var(--border-strong)' },
    solid: { bg: hover ? 'var(--brand-hover)' : 'var(--brand)', color: 'var(--on-brand)', border: 'transparent' },
  };

  const s = sizes[size] || sizes.md;
  const p = palettes[variant] || palettes.ghost;

  return (
    <button
      className="db-hoverable"
      aria-label={label}
      title={label}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: s.box,
        height: s.box,
        flex: '0 0 auto',
        color: p.color,
        background: p.bg,
        border: `1.5px solid ${p.border}`,
        borderRadius: s.radius,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transform: press && !disabled ? 'scale(0.92)' : 'scale(1)',
        transition: 'transform var(--dur-fast) var(--ease-out), background-color var(--dur-fast) var(--ease-out)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
