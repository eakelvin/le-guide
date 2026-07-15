import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/:locale(fr|en)/login", destination: "/:locale/auth/login", permanent: true },
      { source: "/:locale(fr|en)/register", destination: "/:locale/auth/register", permanent: true },
      {
        source: "/:locale(fr|en)/forgot-password",
        destination: "/:locale/auth/forgot-password",
        permanent: true,
      },
      {
        source: "/:locale(fr|en)/update-password",
        destination: "/:locale/auth/update-password",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
