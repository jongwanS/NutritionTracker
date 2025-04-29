/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 기존 API에 대한 프록시 설정 (개발 중 임시로 사용)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*', // 현재 Express 서버 주소
      },
    ];
  },
};

export default nextConfig;