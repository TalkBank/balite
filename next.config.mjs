/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/:path*'
      },
      {
        source: '/openapi.json',
        destination: 'http://127.0.0.1:8000/openapi.json'
      },
    ]
  },
}

export default nextConfig;