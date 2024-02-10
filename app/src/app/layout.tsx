import type { Metadata } from "next";
import "@/globals.css";
import "@mantine/core/styles.css";
import CozyContainer from "@/components/atoms/CozyContainer";
import Header from "@/components/organisms/Header";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import theme from "@/theme";

export const metadata: Metadata = {
  title: "Will Beddow",
  description: "Will Beddow's Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Header />
          <CozyContainer minHeight={"90vh"}>{children}</CozyContainer>
        </MantineProvider>
      </body>
    </html>
  );
}
