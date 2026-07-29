import { api } from '../../lib/api.js';

/* Sleep endpoints.
 * Creating a log POSTs the fields as JSON; the backend does the duration math
 * and hands back how long the night was, already worded for display
 * (e.g. "6.8 hours").
 */

/* <input type="time"> gives "HH:MM"; the API parses "HH:MM:SS". */
function toClockTime(value) {
  return value.split(':').length === 2 ? `${value}:00` : value;
}

export async function createSleepLog({ date, inBed, wokeUp }) {
  const { time } = await api.post('/sleep', {
    date,
    in_bed: toClockTime(inBed),
    woke_up: toClockTime(wokeUp),
  });
  return time;
}
