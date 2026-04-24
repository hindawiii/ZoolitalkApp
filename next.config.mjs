/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! تحذير: هذا سيسمح بالبناء حتى لو وجد أخطاء برمجية
    ignoreBuildErrors: true,
  },
  eslint: {
    // تجاهل أخطاء ESLint أثناء البناء أيضاً
    ignoreDuringBuilds: true,
  },
  // باقي إعداداتك هنا...
};

export default nextConfig;