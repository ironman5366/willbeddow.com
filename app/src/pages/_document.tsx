import { Head, Html, Main, NextScript } from "next/document";
import { ColorSchemeScript } from "@mantine/core";
import { Analytics } from "@vercel/analytics/react";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
      <Analytics />
    </Html>
  );
}
