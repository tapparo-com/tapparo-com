"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import styles from "./ContactForm.module.css";

type Turnstile = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
};
declare global { interface Window { turnstile?: Turnstile } }
type Props = { siteKey: string; resetKey: number; onToken: (token: string) => void; onError: (message: string) => void };

export function ContactChallenge({ siteKey, resetKey, onToken, onError }: Props) {
  const element = useRef<HTMLDivElement>(null);
  const callbacks = useRef({ onToken, onError });
  callbacks.current = { onToken, onError };
  const [ready, setReady] = useState(false);
  const [retry, setRetry] = useState(0);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!ready || !element.current || !window.turnstile) return;
    callbacks.current.onToken("");
    callbacks.current.onError("");
    setFailed(false);
    const fail = () => { callbacks.current.onToken(""); callbacks.current.onError("Die Sicherheitsprüfung konnte nicht abgeschlossen werden. Bitte versuche es erneut oder schreib uns direkt per E-Mail."); setFailed(true); };
    const widget = window.turnstile.render(element.current, {
      sitekey: siteKey, action: "contact", theme: "light", language: "de", size: "flexible",
      callback: (token: string) => { callbacks.current.onToken(token); callbacks.current.onError(""); setFailed(false); },
      "expired-callback": fail, "error-callback": fail, "timeout-callback": fail,
    });
    return () => { window.turnstile?.remove(widget); callbacks.current.onToken(""); };
  }, [ready, siteKey, resetKey, retry]);

  return <div className={styles.challenge}>
    <Script id="contact-turnstile" src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={() => setReady(true)} onError={() => { setFailed(true); onError("Die Sicherheitsprüfung konnte nicht geladen werden. Bitte prüfe deine Verbindung oder schreib uns direkt per E-Mail."); }} />
    <div ref={element} />
    {failed && ready && <button type="button" className={styles.back} onClick={() => setRetry(value => value + 1)}>Sicherheitsprüfung wiederholen</button>}
  </div>;
}
