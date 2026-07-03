/* Do Better — list identity colors.
 * Lists store a color id; the id resolves to a `--list-*` token that stays the
 * same in light and dark mode, so a list never changes identity between themes.
 */
export const LIST_COLORS = [
  { id: 'sprout', label: 'Sprout', value: 'var(--list-sprout)' },
  { id: 'honey', label: 'Honey', value: 'var(--list-honey)' },
  { id: 'dusk', label: 'Dusk', value: 'var(--list-dusk)' },
  { id: 'ember', label: 'Ember', value: 'var(--list-ember)' },
];

export const DEFAULT_LIST_COLOR = 'sprout';

export function getListColorValue(colorId) {
  const color = LIST_COLORS.find((candidate) => candidate.id === colorId);
  return color ? color.value : LIST_COLORS[0].value;
}
