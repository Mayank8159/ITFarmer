import type { Metadata } from "next";
import { Inter, Space_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { CurrencyProvider } from "@/components/CurrencyContext";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-playfair", // keeping variable name to avoid editing globals.css
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.neuralforgehub.tech'),
  title: "Neural Forge Hub | AI & Software Engineering Studio",
  description: "We're the engineering team you wish you had in-house — we build production AI and software, not prototypes.",
  keywords: ["AI Studio", "Software Engineering", "AI Agents", "Web Applications", "Production ML", "Automation", "Full-Stack"],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Neural Forge Hub",
    description: "AI & Software Engineering Studio",
    url: "https://www.neuralforgehub.tech",
    siteName: "Neural Forge Hub",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Neural Forge Hub - Engineering Studio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Neural Forge Hub",
    description: "AI & Software Engineering Studio",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD structured data for rich snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Neural Forge Hub",
    "url": "https://www.neuralforgehub.tech",
    "logo": "https://www.neuralforgehub.tech/favicon.ico",
    "description": "AI & Software Engineering Studio",
    "sameAs": []
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="Mxww6WF0MmcbUdG2w9JmR1_mC-CzuxB1C315DrCmSSo" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script defer data-domain="neuralforgehub.tech" src="https://plausible.io/js/script.js" strategy="afterInteractive" />
      </head>
      <body
        className={`${inter.variable} ${spaceMono.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#e5e5e5] min-h-screen text-black cursor-none`}
      >
        {/* Meta Pixel Code */}
        {process.env.NEXT_PUBLIC_META_PIXEL_ID && 
         process.env.NEXT_PUBLIC_META_PIXEL_ID !== "null" && 
         process.env.NEXT_PUBLIC_META_PIXEL_ID !== "undefined" && (
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}
        
        {/* LinkedIn Insight Tag Code */}
        {process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID && (
          <Script
            id="linkedin-insight"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                _linkedin_partner_id = "${process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID}";
                window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
                window._linkedin_data_partner_ids.push(_linkedin_partner_id);
                (function(l) {
                if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
                window.lintrk.q=[]}
                var s = document.getElementsByTagName("script")[0];
                var b = document.createElement("script");
                b.type = "text/javascript";b.async = true;
                b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
                s.parentNode.insertBefore(b, s);})(window.lintrk);
              `,
            }}
          />
        )}

        <CurrencyProvider>
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </CurrencyProvider>
      </body>
    </html>
  );
}