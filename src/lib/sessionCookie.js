// src/lib/sessionCookie.js
import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "session";
const isProd = process.env.NODE_ENV === "production";

// Set only if you need to share the cookie across subdomains (e.g., .perktify.com)
// Leave undefined to scope the cookie to the current host.
const DOMAIN = process.env.SESSION_COOKIE_DOMAIN || undefined;

/**
 * Set the secure session cookie.
 * @param {{ secret: string, expiresAt?: Date|string|number }} opts
 */
export function setSessionCookie({ secret, expiresAt }) {
  cookies().set(SESSION_COOKIE_NAME, secret, {
    httpOnly: true,
    secure: isProd,          // on http://localhost a Secure cookie won't set
    sameSite: "strict",
    ...(DOMAIN ? { domain: DOMAIN } : {}),
    path: "/",
    ...(expiresAt ? { expires: new Date(expiresAt) } : {}),
  });
}

/** Clear the session cookie (logout). */
export function clearSessionCookie() {
  cookies().set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    ...(DOMAIN ? { domain: DOMAIN } : {}),
    path: "/",
    expires: new Date(0),
  });
}

/** Read the session cookie value (server-side only). */
export function getSessionCookie() {
  return cookies().get(SESSION_COOKIE_NAME)?.value;
}
