import * as nxPlugin from '@nrwl/next/plugins/with-nx.js';

const withNx = nxPlugin?.default ?? nxPlugin?.withNx ?? nxPlugin;

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const baseConfig = {
  async rewrites() {
    return [
      // Proxy /audio/* vers le backend (fichiers MP3 Habibi-TTS)
      {
        source: '/audio/:path*',
        destination: `${API_URL}/audio/:path*`,
      },
    ];
  },
};

const config = typeof withNx === 'function' ? withNx(baseConfig) : baseConfig;

export default config;
