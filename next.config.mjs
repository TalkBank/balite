/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    urlImports: [
      "https://sla2.talkbank.org/authUI/authModals.js",
      "https://sla2.talkbank.org/authUI/authModalsCSS.js"
    ],
    serverActions: {
      bodySizeLimit: '2gb',
    },
  },
}


export default nextConfig;