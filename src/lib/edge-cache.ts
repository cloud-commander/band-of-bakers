// Helper to add Cache-Control with stale-while-revalidate for Edge responses.
export function addCacheControl(
  response: Response,
  maxAgeSeconds: number,
  staleWhileRevalidateSeconds: number
) {
  response.headers.set(
    "Cache-Control",
    `public, max-age=${maxAgeSeconds}, stale-while-revalidate=${staleWhileRevalidateSeconds}`
  );
}
