import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/storefront";
import { StoreProvider } from "../components/store-provider";
import { storeConfig } from "../lib/store-config";
import "./globals.css";

export const metadata: Metadata = {
  title: `${storeConfig.name} | Find a little more room`,
  description: "A demonstration storefront for phones, tablets, laptops, and accessories.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={storeConfig.locale} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{const theme=localStorage.getItem("morrow-theme");if(theme==="light"||theme==="dark")document.documentElement.dataset.theme=theme}catch(error){console.error("Unable to read the saved theme preference.",error)}',
          }}
        />
      </head>
      <body>
        <StoreProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </StoreProvider>
      </body>
    </html>
  );
}
