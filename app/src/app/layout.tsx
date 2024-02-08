import '@mantine/core/styles.css';
import type { Metadata } from "next";
import "./globals.css";
import AppTree from "@/components/organisms/AppTree";

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
            <AppTree>
                {children}
            </AppTree>
        </body>
    </html>
  );
}
