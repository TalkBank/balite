/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    urlImports: [
      "https://sla2.talkbank.org/authUI/authModals.js",
      "https://sla2.talkbank.org/authUI/authModalsCSS.js"
    ],
    serverActions: {
      bodySizeLimit: '2gb',
      allowedOrigins: [
      "whisper.talkbank.org",
      "localhost:3000"]
    },
  },
}


export default nextConfig;