/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    urlImports: [
      "https://sla2.talkbank.org/authUI/authModals.js",
      "https://sla2.talkbank.org/authUI/authModalsCSS.js"
    ],
    middlewareClientMaxBodySize: '2gb',
    serverActions: {
      bodySizeLimit: '2gb',
      allowedOrigins: [
      "baweb.talkbank.org",
      "localhost:3000"]
    },
  },
}


export default nextConfig;
