import React, { useEffect, useRef } from "react";

interface AdBannerProps {
  adClient?: string;
  adSlot?: string;
  style?: React.CSSProperties;
}

export function AdBanner({ adClient, adSlot, style }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const adEl = adRef.current;
    if (!adEl) return;

    // Only push if ad is not processed yet
    if (!(adEl as any).adsbygoogleProcessed) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        // Mark this ad as processed
        (adEl as any).adsbygoogleProcessed = true;
      } catch (e) {
        console.error("Adsense error:", e);
      }
    }
  }, []);

  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={style || { display: "block", width: 300, height: 100 }}
      data-ad-client={adClient || "ca-pub-5920039237214291"}
      data-ad-slot={adSlot || "2642238456"}
    ></ins>
  );
}
