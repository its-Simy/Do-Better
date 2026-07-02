import React from 'react';

/**
 * Do Better — Avatar
 * Round user/profile token. Renders an image, or initials on a tinted ground.
 */
export function Avatar({ src, name = '', size = 40, tone = 'brand', style = {}, ...rest }) {
  const tones = {
    brand: { bg: 'var(--brand-subtle)', fg: 'var(--brand-active)' },
    accent: { bg: 'var(--accent-subtle)', fg: 'var(--ember-700)' },
    sleep: { bg: 'var(--sleep-subtle)', fg: 'var(--dusk-700)' },
    neutral: { bg: 'var(--surface-inset)', fg: 'var(--text-secondary)' },
  };
  const t = tones[tone] || tones.brand;
  const initials = name.split(' ').map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();

  return (
    <span style={{
      width: size, height: size, flex: '0 0 auto', borderRadius: '50%',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: t.bg, color: t.fg, overflow: 'hidden',
      fontFamily: 'var(--font-sans)', fontWeight: 'var(--fw-bold)',
      fontSize: Math.max(11, size * 0.38), boxShadow: 'inset 0 0 0 1.5px var(--border-subtle)',
      ...style,
    }} {...rest}>
      {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
    </span>
  );
}
