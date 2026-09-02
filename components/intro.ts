/*
 * Plain module — deliberately NOT "use client". The pre-paint gate script in
 * app/layout.tsx is inlined by a server component, and a value imported from a
 * client module would arrive there as a client reference (i.e. `undefined`)
 * rather than this string.
 */

/** Set once the intro has played, so it runs once per browser session. */
export const INTRO_SESSION_KEY = "2z-intro-seen";
