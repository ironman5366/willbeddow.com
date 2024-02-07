import '@mantine/core/styles.css';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {MantineProvider} from "@mantine/core";
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
        <body>
            <MantineProvider theme={theme}>
              {children}
            </MantineProvider>
        </body>
    </html>
  );
}
