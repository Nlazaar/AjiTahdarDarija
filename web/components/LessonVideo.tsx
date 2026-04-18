'use client';

import { useState } from 'react';

function isYouTube(url: string) { return /youtu\.?be/.test(url); }
function isVimeo(url: string)   { return /vimeo\.com/.test(url); }

function youtubeEmbed(url: string): string {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}?rel=0&modestbranding=1` : url;
}

function vimeoEmbed(url: string): string {
  const m = url.match(/vimeo\.com\/(\d+)/);
  return m ? `https://player.vimeo.com/video/${m[1]}` : url;
}

export default function LessonVideo({
  url, poster, title, onContinue,
}: {
  url: string;
  poster?: string | null;
  title?: string;
  onContinue: () => void;
}) {
  const [playing, setPlaying] = useState(false);

  const embed = isYouTube(url) ? youtubeEmbed(url)
              : isVimeo(url)   ? vimeoEmbed(url)
              : url;

  const isIframe = isYouTube(url) || isVimeo(url);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto p-4">
      {title && <h2 className="text-xl font-black text-center" style={{ color: '#e8eaed' }}>{title}</h2>}

      <div className="w-full aspect-video rounded-2xl overflow-hidden relative" style={{ background: '#1e2d35', border: '2px solid #2a3d47' }}>
        {!playing && poster && (
          <button
            onClick={() => setPlaying(true)}
            className="absolute inset-0 w-full h-full group"
            style={{ backgroundImage: `url(${poster})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            aria-label="Lire la vidéo"
          >
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: '#58cc02', boxShadow: '0 6px 0 #46a302' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="white"><path d="M8 5.14v14l11-7-11-7z"/></svg>
              </div>
            </div>
          </button>
        )}

        {(playing || !poster) && (
          isIframe ? (
            <iframe
              src={embed}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={title ?? 'Vidéo de la leçon'}
            />
          ) : (
            <video
              src={url}
              controls
              autoPlay={playing}
              poster={poster ?? undefined}
              className="w-full h-full"
            />
          )
        )}
      </div>

      <button
        onClick={onContinue}
        className="px-8 py-3 rounded-xl text-[14px] font-black uppercase tracking-wider text-white"
        style={{ background: '#58cc02', boxShadow: '0 4px 0 #46a302' }}
      >
        Continuer
      </button>
    </div>
  );
}
