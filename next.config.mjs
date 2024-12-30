/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8002',
        pathname: '/uploads/**',
      },
    ],
  },
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },

  webpack: (config) => {
    config.infrastructureLogging = {
      level: 'error',
    };
    
    // Add Font Awesome loader
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|svg)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000,
          publicPath: '/_next/static/fonts/',
          outputPath: 'static/fonts/',
          name: '[name].[ext]',
        },
      },
    });

    return config;
  },
  // Add this to properly handle CSS files
  optimizeFonts: false,
  sassOptions: {
    includePaths: ['./styles'],
  },
};

export default nextConfig;