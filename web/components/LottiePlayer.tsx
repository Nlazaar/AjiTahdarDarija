'use client';

import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

type Props = {
  src: string;
  size?: number | string;
  width?: number | string;
  height?: number | string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  style?: React.CSSProperties;
  fallback?: React.ReactNode;
};

export default function LottiePlayer({
  src,
  size,
  width,
  height,
  loop = true,
  autoplay = true,
  className,
  style,
  fallback = null,
}: Props) {
  const [data, setData] = useState<any>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const path = src.startsWith('/') ? src : `/lottie/${src}`;
    fetch(path)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j) => { if (!cancelled) setData(j); })
      .catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [src]);

  const dims: React.CSSProperties = {
    width: width ?? size ?? '100%',
    height: height ?? size ?? 'auto',
  };

  if (failed) return <>{fallback}</>;
  if (!data) return <div className={className} style={{ ...dims, ...style }} />;

  return (
    <div className={className} style={{ ...dims, ...style }}>
      <Lottie animationData={data} loop={loop} autoplay={autoplay} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
