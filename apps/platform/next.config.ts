import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';
const { composePlugins, withNx } = require('@nx/next');

const withNextIntl = createNextIntlPlugin();

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig: NextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  }
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  withNextIntl, // Add the next-intl plugin
];

module.exports = composePlugins(...plugins)(nextConfig);
