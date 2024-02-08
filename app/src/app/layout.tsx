import type { Metadata } from "next";
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
