import * as nxPlugin from '@nrwl/next/plugins/with-nx.js';

const withNx = nxPlugin?.default ?? nxPlugin?.withNx ?? nxPlugin;

const baseConfig = {};

const config = typeof withNx === 'function' ? withNx(baseConfig) : baseConfig;

export default config;
