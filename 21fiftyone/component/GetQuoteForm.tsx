'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * GetQuoteForm
 * ---------------------------------------------------------------
 * Embeds the Bigin "Get Quote" web-to-record form (public/forms/get-quote.html)
 * in a same-origin iframe and silently prefills four fields that are
 * visible on the form but shouldn't require the visitor to type anything:
 *
 *   Lead Page URL  -> POTENTIALCF4  (the page the visitor filled the form from)
 *   UTM Source     -> POTENTIALCF5  (?utm_source=...)
 *   UTM Campaign   -> POTENTIALCF7  (?utm_campaign=...)
 *   UTM Content    -> POTENTIALCF6  (?utm_content=...)
 *
 * The form's own script (see the <script> block at the bottom of
 * get-quote.html) already listens for a `window.postMessage` of the
 * shape { type: 'bigin-prefill', payload: {...} } and writes the
 * values straight into those inputs — this component is just the
 * sender half of that handshake.
 *
 * Because Zoho's servlet-loaded script (`wf_script`) attaches its own
 * behaviour asynchronously, we don't rely on a single message: the
 * iframe pings us back with `bigin-ready` the moment its DOM is parsed,
 * and we also retry a couple of times after `onLoad` fires, in case the
 * very first message races the iframe's own listener setup.
 * ------------------------------------------------------------------- */

export interface GetQuoteFormProps {
  /** Path to the hosted form file. Defaults to the file placed under /public/forms. */
  src?: string;
  /** Minimum iframe height in pixels. */
  minHeight?: number;
  /** Optional className applied to the wrapping <div>. */
  className?: string;
  /**
   * Override any of the four prefill values manually (useful for SSR/tests,
   * or when you're driving this from something other than the URL, e.g. a
   * value stored in a cookie or your own attribution store). Anything not
   * provided here falls back to reading the current page's URL.
   */
  overrides?: Partial<PrefillPayload>;
}

interface PrefillPayload {
  leadPageUrl: string;
  utmSource: string;
  utmCampaign: string;
  utmContent: string;
}

const DEFAULT_SRC = '/forms/get-quote.html';
const RETRY_DELAYS_MS = [300, 1000, 2000]; // covers slow wf_script + reCAPTCHA loads

export default function GetQuoteForm({
  src = DEFAULT_SRC,
  minHeight = 900,
  className,
  overrides,
}: GetQuoteFormProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const ackedRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const buildPayload = useCallback((): PrefillPayload => {
    let utmSource = '';
    let utmCampaign = '';
    let utmContent = '';
    let leadPageUrl = '';

    if (typeof window !== 'undefined') {
      leadPageUrl = window.location.href;
      const params = new URLSearchParams(window.location.search);
      utmSource = params.get('utm_source') ?? '';
      utmCampaign = params.get('utm_campaign') ?? '';
      utmContent = params.get('utm_content') ?? '';
    }

    return {
      leadPageUrl: overrides?.leadPageUrl ?? leadPageUrl,
      utmSource: overrides?.utmSource ?? utmSource,
      utmCampaign: overrides?.utmCampaign ?? utmCampaign,
      utmContent: overrides?.utmContent ?? utmContent,
    };
  }, [overrides]);

  const sendPrefill = useCallback(() => {
    const win = iframeRef.current?.contentWindow;
    if (!win || ackedRef.current) return;
    win.postMessage(
      { type: 'bigin-prefill', payload: buildPayload() },
      window.location.origin,
    );
  }, [buildPayload]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const scheduleRetries = useCallback(() => {
    clearTimers();
    RETRY_DELAYS_MS.forEach((delay) => {
      timersRef.current.push(setTimeout(sendPrefill, delay));
    });
  }, [sendPrefill]);

  const handleLoad = () => {
    setIframeLoaded(true);
    sendPrefill();
    scheduleRetries();
  };

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (!event.data) return;

      // The iframe tells us its DOM is ready — send (or resend) immediately.
      if (event.data.type === 'bigin-ready') {
        sendPrefill();
      }

      // The iframe confirms it wrote the values — stop retrying.
      if (event.data.type === 'bigin-prefill-ack') {
        ackedRef.current = true;
        clearTimers();
      }
    }

    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('message', onMessage);
      clearTimers();
    };
  }, [sendPrefill]);

  // If overrides change after mount (e.g. attribution resolved async),
  // re-send with the latest values.
  useEffect(() => {
    if (iframeLoaded) {
      ackedRef.current = false;
      sendPrefill();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overrides?.leadPageUrl, overrides?.utmSource, overrides?.utmCampaign, overrides?.utmContent]);

  return (
    <div className={className} style={{ width: '100%' }}>
      <iframe
        ref={iframeRef}
        src={src}
        onLoad={handleLoad}
        title="Get a Quote"
        style={{
          width: '100%',
          minHeight,
          border: 'none',
          display: 'block',
        }}
      />
    </div>
  );
}