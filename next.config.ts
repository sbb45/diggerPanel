import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    compiler: {
        styledComponents: {
            ssr: true,
            displayName: true,
        },
    },
    basePath: '/admin',
    output: 'export',
    assetPrefix: '/admin'
};

export default nextConfig;
