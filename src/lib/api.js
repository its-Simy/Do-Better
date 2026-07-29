/* Do Better — API transport.
 * One place that knows how to reach the FastAPI backend, so pages only ever
 * describe *what* they want, never how the request is made.
 *
 * In dev, requests go to /api and Vite proxies them to the backend (see
 * vite.config.js). Set VITE_API_URL to point at a deployed API instead.
 */
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request(path, { method = 'GET', body } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    /* Network-level failure: backend not running, or the proxy can't reach it. */
    throw new ApiError('Could not reach the server.', 0);
  }

  if (!response.ok) {
    throw new ApiError(`Request failed (${response.status}).`, response.status);
  }
  return response.json();
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
};
