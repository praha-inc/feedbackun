import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

import type { NextConfig } from 'next';

void initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  typedRoutes: true,
};

const withVanillaExtract = createVanillaExtractPlugin();

export default withVanillaExtract(nextConfig);
